import React, { useEffect, useRef, useState } from 'react'
import './Dropzone.css'
import { FaUpload } from 'react-icons/fa'
import { AiFillCloseCircle } from 'react-icons/ai'
import PropTypes from 'prop-types'

export default function Dropzone(props) {
  const WrapperRef = useRef(null)

  const [description, setDescription] = useState('')

  const [image, setImage] = useState()
  const [imagePreview, setImagePreview] = useState()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image)
      setImagePreview(objectUrl)

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [image])

  const onDragEnter = () => WrapperRef.current.classList.add('dragover')
  const onDragLeave = () => WrapperRef.current.classList.remove('dragover')

  const onDrop = () => WrapperRef.current.classList.remove('dragover')

  const onFileDrop = (e) => {
    const newFile = e.target.files[0]
    if (newFile) {
      setImage(newFile)
      props.onFileChange(newFile)
    }
  }

  return (
    <>
      <div
        ref={WrapperRef}
        className='drop-container'
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className={
            image
              ? 'image-preview-container'
              : 'image-preview-container hide-container'
          }
        >
          {image ? (
            <div className='image-manipulation'>
              <div className='image-preview-container'>
                <img src={imagePreview} alt='uploaded-image' />
              </div>
              <div className='delete-btn' onClick={() => setImage(null)}>
                <AiFillCloseCircle />
              </div>
            </div>
          ) : (
            <div className='drag-and-drop-msg'>
              <h1>Drop Image Here</h1>
              <label htmlFor='image-input' className='input-button'>
                <FaUpload />
                <p>Upload Image</p>
              </label>
            </div>
          )}
        </div>
        <input
          type='file'
          name='image-input'
          id='image-input'
          accept='image/*'
          onChange={onFileDrop}
        />
      </div>
      <footer>
        <button type='submit' className='description-btn'>
          Tell me!
        </button>
        <div className='description-box'>
          {description
            ? description
            : 'Description of your image will appear here.'}
        </div>
      </footer>

      <div className={`circle1 ${isLoading ? 'ani1' : ''}`}></div>
      <div className={`circle2 ${isLoading ? 'ani2' : ''}`}></div>
    </>
  )
}

Dropzone.propTypes = {
  onFileChange: PropTypes.func,
}
