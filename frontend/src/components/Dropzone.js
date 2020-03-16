import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

const ACCEPTED_FORMATS = ["jpg", "jpeg", "png"]
const MAX_SIZE = 1000000

function MyDropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(element => {
      if (ACCEPTED_FORMATS.includes(element.type.split("/")[1]) && element.size < MAX_SIZE) {
        props.onDrop(element)
      }
    });
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <div style={{
            width: "80%",
            border: "dashed 3px #c1c1c1",
            margin: "auto",
            height: "80%",
            marginTop: 30,
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",/* align horizontal */
            alignItems: "center"
          }}>
            <span style={{
              margin: "auto",
              fontSize: 16,
              color: "#c1c1c1",
              fontWeight: "bold"
            }}
            >
              Drag 'n' drop files here, or click to select files</span>
          </div>
      }
    </div>
  )
}

export default MyDropzone
