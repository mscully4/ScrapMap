import React, {useCallback} from 'react'
import { useDropzone } from 'react-dropzone'
import { FONT_GREY } from '../../utils/colors'

const ACCEPTED_FORMATS = ["jpg", "jpeg", "png"]
const MAX_SIZE = 20000000

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
      border: `dashed 3px ${FONT_GREY}`, 
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
          <div >
            <p style={{
              margin: "auto",
              fontSize: 16,
              color: `${FONT_GREY}`,
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
