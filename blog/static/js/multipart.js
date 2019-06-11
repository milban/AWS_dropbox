/**
* @param {File|Blob} - file to slice
* @param {Number} - chunksAmount
* @return {Array} - an array of Blobs
**/
function sliceFile(file) {
    var byteIndex = 0 //청크 시작점
    var byteEnd = 0 //청크 종료점
    var chunks = []
    var chunkSize = 5 * 1024 * 1024 * 1024 //5GB
    var chunksAmount = Math.ceil(file.size / chunkSize) //5MB짜리 몇조각으로 나뉘는지?    

    for (var i = 0; i < chunksAmount; i += 1) { //청크 갯수만큼 반복
      byteEnd = chunkSize * (i + 1) -1; //청크 종료점은 
      chunks.push(file.slice(byteIndex, byteEnd));
      byteIndex += (byteEnd - byteIndex) + 1;
    }  
    return chunks
  }

  function mergeFile(fileList){
      var chunksAmount = fileList.length
      var mergedFile = fileList[0]
      var tempArr = mergedFile.File_Name.split('.')
      mergedFile.File_Name = tempArr[0] + '.' + tempArr[1] //a/b/c.txt.1 중 .1은 뗌      
      
      for (var i = 1; i < chunksAmount; i += 1) { //청크 갯수-1 만큼 반복 (mergedFile은 이미 첫번째 청크를 가지고 있으니까)
        mergedfile += fileList[i]
      }  
      return mergedFile
  }