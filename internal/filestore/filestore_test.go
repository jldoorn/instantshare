package filestore

import (
	"os"
	"testing"
)

func TestBoardConstructTeardown(t *testing.T) {
	var fs FileStorer = NewDiskStore()
	store, err := fs.CreateNewBoard()
	if err != nil {
		t.Error(err)
	}
	toUpload, err := os.Open("testfile.txt")
	if err != nil {
		t.Error(err)
	}
	defer toUpload.Close()
	_, err = fs.UploadFile(store, "new file", toUpload)
	if err != nil {
		t.Error(err)
	}
	fs.RemoveBoard(store)
}
