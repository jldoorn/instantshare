package main

import (
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jldoorn/instantshare/internal/filestore"
	"github.com/jldoorn/wsnotifier"
)

type fileServer struct {
	store filestore.FileStorer
}

const (
	upload  = iota
	delete  = iota
	destroy = iota
)

type Notification struct {
	Status  int         `json:"status"`
	Payload interface{} `json:"payload"`
}

var notifierPool *wsnotifier.NotifierPool

func NewFileServer() *fileServer {
	store, err := filestore.NewAwsStore()
	if err != nil {
		return nil
	}
	return &fileServer{store: store}
}

func renderJSON(w http.ResponseWriter, v interface{}) {
	js, err := json.Marshal(v)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func sendFile(w http.ResponseWriter, r io.Reader, filename string, length int64) {
	h := w.Header()
	h.Add("Content-Disposition", "attachment; filename="+`"`+filename+`"`)
	fNameSplit := strings.Split(filename, ".")
	h.Add("Content-Type", mime.TypeByExtension("."+fNameSplit[len(fNameSplit)-1]))
	h.Add("Content-Length", strconv.Itoa(int(length)))
	io.Copy(w, r)
}

func (fs *fileServer) dummyHandler(w http.ResponseWriter, r *http.Request) {
	f, err := os.Open("doorn.jpg")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()
	stat, err := f.Stat()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	sendFile(w, f, f.Name(), stat.Size())
}

func (fs *fileServer) boardCreateHandler(w http.ResponseWriter, r *http.Request) {
	store, err := fs.store.CreateNewBoard()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	notifierPool.AddBroadcast(store.Id)
	renderJSON(w, store)
}

func (fs *fileServer) boardSubscribeHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	fmt.Println("Subscribing a client to the board")
	notifierPool.SubscribeClient(id, w, r)
}

func (fs *fileServer) boardAbandonHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if fs.store.BoardExists(id) {
		err := fs.store.RemoveBoard(filestore.FileBoard{Id: id})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		notifierPool.BroadcastAt(id, Notification{Status: destroy, Payload: "destroying"})
		notifierPool.RemoveBroadcast(id)
	}
}

func (fs *fileServer) fileSummaryHandler(w http.ResponseWriter, r *http.Request) {
	summary := fs.store.GetAllFiles(filestore.FileBoard{Id: mux.Vars(r)["id"]})
	renderJSON(w, summary)
}

func (fs *fileServer) fileUploadHandler(w http.ResponseWriter, r *http.Request) {
	// for k := range r.MultipartForm.File
	id := mux.Vars(r)["id"]
	f, head, err := r.FormFile("upload")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	sf, err := fs.store.UploadFile(filestore.FileBoard{Id: id}, head.Filename, f)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	notifierPool.BroadcastAt(id, Notification{Status: upload, Payload: sf})
	renderJSON(w, sf)
}

// Still need to test this
func (fs *fileServer) fileDownloadHandler(w http.ResponseWriter, r *http.Request) {
	fname := fs.store.GetFileName(filestore.FileBoard{Id: mux.Vars(r)["id"]}, mux.Vars(r)["fid"])
	f, err := fs.store.GetSingleFile(filestore.FileBoard{Id: mux.Vars(r)["id"]}, mux.Vars(r)["fid"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()
	stat, err := f.Stat()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	sendFile(w, f, fname, stat.Size())
}

func (fs *fileServer) fileRemoveHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	fid := mux.Vars(r)["fid"]
	err := fs.store.DeleteFile(filestore.FileBoard{Id: id}, fid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	notifierPool.BroadcastAt(id, Notification{Status: delete, Payload: fid})
}

func (fs *fileServer) boardListHandler(w http.ResponseWriter, r *http.Request) {
	renderJSON(w, fs.store.GetBoards())
}

func (fs *fileServer) boardExistsHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if fs.store.BoardExists(id) {
		renderJSON(w, fs.store.GetBoard(id))
	} else {
		w.WriteHeader(http.StatusNotFound)
		renderJSON(w, Notification{Status: http.StatusNotFound, Payload: "error no board found"})
	}
}

func main() {
	router := mux.NewRouter()
	router.StrictSlash(true)
	server := NewFileServer()
	notifierPool = wsnotifier.NewNotifierPool()

	c := handlers.CORS(handlers.AllowedMethods([]string{"GET", "DELETE", "PUT", "POST"}), handlers.AllowedOrigins([]string{"*"}))
	os.RemoveAll("tmp")
	os.Mkdir("tmp", os.ModePerm)

	// All done with basic frontend tasks, now need to make the backend
	router.HandleFunc("/board", server.boardListHandler).Methods("GET")
	router.HandleFunc("/board", server.boardCreateHandler).Methods("POST")
	router.HandleFunc("/board/{id}/subscribe", server.boardSubscribeHandler).Methods("GET")
	router.HandleFunc("/board/{id}", server.boardAbandonHandler).Methods("DELETE")
	router.HandleFunc("/board/{id}", server.boardExistsHandler).Methods("GET")

	router.HandleFunc("/board/{id}/files", server.fileSummaryHandler).Methods("GET")
	router.HandleFunc("/board/{id}/files", server.fileUploadHandler).Methods("POST")
	router.HandleFunc("/board/{id}/files/{fid}", server.fileDownloadHandler).Methods("GET")
	router.HandleFunc("/board/{id}/files/{fid}", server.fileRemoveHandler).Methods("DELETE")
	router.HandleFunc("/dummy", server.dummyHandler).Methods("GET")

	http.ListenAndServe(":5000", c(router))
}
