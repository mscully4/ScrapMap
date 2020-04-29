import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

const ACCEPTED_FORMATS = ["jpg", "jpeg", "png"]
const MAX_SIZE = 10000000

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
    <div {...getRootProps()} className={props.className} style={{
      width: "80%", 
      border: "dashed 3px #c1c1c1", 
      margin: 'auto',
      borderRadius: 20,
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      cursor: 'pointer'
      }}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <div><p>Drop the files here ...</p></div> :
          <div 
          // style={{
          //   width: "80%",
          //   border: "dashed 3px #c1c1c1",
          //   margin: "auto",
          //   marginTop: 30,
          //   borderRadius: 20,
          //   display: "flex",
          //   justifyContent: "center",/* align horizontal */
          //   alignItems: "center"
          // }}
          >
            <p style={{
              margin: "auto",
              fontSize: 16,
              color: "#c1c1c1",
              fontWeight: "bold"
            }}
            >
              Drag 'n' drop files here, or click to select files</p>
          </div>
      }
    </div>
  )
}

export default MyDropzone
