package filestore

import (
	"context"
	"crypto/rand"
	"io"
	"math/big"
	"os"
	"sort"
	"strconv"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type AwsFileStore struct {
	fileLibrary map[string]map[string]StoredFile
	client      *s3.Client
}

func NewAwsStore() *AwsFileStore {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil
	}
	return &AwsFileStore{fileLibrary: make(map[string]map[string]StoredFile), client: s3.NewFromConfig(cfg)}
}

func (fs *AwsFileStore) lookupFile(store FileBoard, id string) (StoredFile, error) {
	return fs.fileLibrary[store.Id][id], nil
}

func (fs *AwsFileStore) GetFileName(store FileBoard, id string) string {
	return fs.fileLibrary[store.Id][id].Name
}

func (fs *AwsFileStore) BoardExists(id string) bool {
	_, ok := fs.fileLibrary[id]

	return ok
}

func (fs *AwsFileStore) GetBoard(id string) FileBoard {
	if fs.BoardExists(id) {
		return FileBoard{Id: id}
	} else {
		return FileBoard{}
	}
}

func (fs *AwsFileStore) GetAllFiles(store FileBoard) []StoredFile {
	s := []StoredFile{}
	for _, v := range fs.fileLibrary[store.Id] {
		s = append(s, v)
	}

	sort.Slice(s, func(i, j int) bool {
		return s[i].Id < s[j].Id
	})

	return s
}

func (fs *AwsFileStore) GetSingleFile(store FileBoard, id string) (*os.File, error) {
	// better to call function with an io Writer?

	sf, err := fs.lookupFile(store, id)
	if err != nil {
		return nil, err
	}

	o, err := fs.client.GetObject(context.TODO(), &s3.GetObjectInput{})

	return os.Open(sf.path)
}

func (fs *AwsFileStore) UploadFile(store FileBoard, name string, uploadData io.Reader) (StoredFile, error) {
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

func (fs *AwsFileStore) DeleteFile(store FileBoard, id string) error {
	delete(fs.fileLibrary[store.Id], id)
	return os.Remove("tmp/" + store.Id + "/" + id)
}

func (fs *AwsFileStore) CreateNewBoard() (FileBoard, error) {
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

func (fs *AwsFileStore) RemoveBoard(store FileBoard) error {
	err := os.RemoveAll("tmp/" + store.Id)

	delete(fs.fileLibrary, store.Id)
	return err
}

func (fs *AwsFileStore) GetBoards() []FileBoard {
	boards := []FileBoard{}

	for k := range fs.fileLibrary {
		boards = append(boards, FileBoard{Id: k})
	}

	return boards
}
