package filestore

import (
	"crypto/rand"
	"io"
	"math/big"
	"os"
	"sort"
	"strconv"

	"github.com/google/uuid"
)

type FileStorer interface {
	GetAllFiles(store FileBoard) []StoredFile
	GetSingleFile(store FileBoard, id string) (*os.File, error)
	UploadFile(store FileBoard, name string, uploadData io.Reader) (StoredFile, error)
	DeleteFile(store FileBoard, id string) error
	CreateNewBoard() (FileBoard, error)
	RemoveBoard(store FileBoard) error
	GetFileName(store FileBoard, id string) string
	GetBoards() []FileBoard
	BoardExists(id string) bool
	GetBoard(id string) FileBoard
}

type DiskFileStore struct {
	fileLibrary map[string]map[string]StoredFile
}

type FileBoard struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type StoredFile struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	path string
}

func NewDiskStore() *DiskFileStore {
	return &DiskFileStore{fileLibrary: make(map[string]map[string]StoredFile)}
}

func (fs *DiskFileStore) lookupFile(store FileBoard, id string) (StoredFile, error) {
	return fs.fileLibrary[store.Id][id], nil
}

func (fs *DiskFileStore) GetFileName(store FileBoard, id string) string {
	return fs.fileLibrary[store.Id][id].Name
}

func (fs *DiskFileStore) BoardExists(id string) bool {
	_, ok := fs.fileLibrary[id]

	return ok
}

func (fs *DiskFileStore) GetBoard(id string) FileBoard {
	if fs.BoardExists(id) {
		return FileBoard{Id: id}
	} else {
		return FileBoard{}
	}
}

func (fs *DiskFileStore) GetAllFiles(store FileBoard) []StoredFile {
	s := []StoredFile{}
	for _, v := range fs.fileLibrary[store.Id] {
		s = append(s, v)
	}

	sort.Slice(s, func(i, j int) bool {
		return s[i].Id < s[j].Id
	})

	return s
}

func (fs *DiskFileStore) GetSingleFile(store FileBoard, id string) (*os.File, error) {
	// better to call function with an io Writer?

	sf, err := fs.lookupFile(store, id)
	if err != nil {
		return nil, err
	}

	return os.Open(sf.path)
}

func (fs *DiskFileStore) UploadFile(store FileBoard, name string, uploadData io.Reader) (StoredFile, error) {
	file_id := uuid.New()
	savePath := "tmp/" + store.Id + "/" + file_id.String()

	f, err := os.Create(savePath)
	if err != nil {
		return StoredFile{}, err
	}
	defer f.Close()
	io.Copy(f, uploadData)
	fileObj := StoredFile{Id: file_id.String(), Name: name, path: savePath}
	fs.fileLibrary[store.Id][file_id.String()] = fileObj
	return fileObj, nil
}

func (fs *DiskFileStore) DeleteFile(store FileBoard, id string) error {
	delete(fs.fileLibrary[store.Id], id)
	return os.Remove("tmp/" + store.Id + "/" + id)
}

func (fs *DiskFileStore) CreateNewBoard() (FileBoard, error) {
	// Should create a new directory to store the files of a board
	randId, _ := rand.Int(rand.Reader, big.NewInt(2e9))
	board_id := strconv.FormatUint(randId.Uint64(), 36)
	err := os.Mkdir("tmp/"+board_id, os.ModePerm)
	if err != nil {
		return FileBoard{}, err
	}

	fs.fileLibrary[board_id] = make(map[string]StoredFile)
	return FileBoard{Id: board_id}, nil
}

func (fs *DiskFileStore) RemoveBoard(store FileBoard) error {
	err := os.RemoveAll("tmp/" + store.Id)

	delete(fs.fileLibrary, store.Id)
	return err
}

func (fs *DiskFileStore) GetBoards() []FileBoard {
	boards := []FileBoard{}

	for k := range fs.fileLibrary {
		boards = append(boards, FileBoard{Id: k})
	}

	return boards
}
