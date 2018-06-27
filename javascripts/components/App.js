// @flow

import $ from 'jquery'
import React, { Component } from 'react'
import classNames from 'classnames'
import _ from 'lodash'

type Props = {}

type State = {
  imageUrl: ?string,
}

export default class App extends Component<Props, State> {
  constructor(...args: Array<any>) {
    super(...args)

    this.state = {
      imageUrl: undefined,
      rotation: undefined,
    }
  }

  render() {
    let { imageUrl, rotation } = this.state

    let imagePreviewStyle = {}
    if (imageUrl) {
      imagePreviewStyle = { backgroundImage: `url('${imageUrl}')` }
    }

    let uploadOverlayClass = classNames({
      'upload-overlay': true,
      'upload-overlay-black': !!imageUrl
    })

    let uploadOverlayFrame = undefined
    if (!!imageUrl) {
      uploadOverlayFrame = (
        uploadOverlayFrame = (
          <div className='upload-overlay-frame'>
            <i className='fa fa-cloud-upload-alt'></i> Upload Another Image
          </div>
        )
      )
    } else {
      uploadOverlayFrame = (
        <div className='upload-overlay-frame'>
          Click to upload file
        </div>
      )
    }

    let imageRotationPreviewStyle = {}
    if (imageUrl && _.isNumber(rotation)) {
      imageRotationPreviewStyle = {
        backgroundImage: `url('${imageUrl}')`,
        transform: `rotate(${rotation}deg)`,
      }
    }

    return (
      <div className='app-pane'>
        <div className='left-pane'>
          <div className='image-upload'>
            <div className='image-preview' style={imagePreviewStyle}></div>
            <input ref='fileInput' type='file' className='file-select' accept="image/*"
                   onChange={this.onChangeFile.bind(this)} />
            <div className={uploadOverlayClass} onClick={this.onClickUploadOverlay.bind(this)}>
              {uploadOverlayFrame}
            </div>
          </div>
        </div>
        <div className='right-pane'>
          <div className='image-rotation-preview' style={imageRotationPreviewStyle}></div>
        </div>
      </div>
    )
  }

  fetchRotation(file) {
    let self = this
    let fd = new FormData()
    fd.append('image', file)

    $.ajax({
      url: '/images/rotation',
      cache: false,
      contentType: false,
      processData: false,
      data: fd,
      type: 'post',
    }).done(function(data) {
      self.setState({ rotation: data.rotation * -90 })
    })
  }

  onChangeFile(event) {
    let self = this
    let file = event.target.files[0]
    let reader = new FileReader()
    if (file) {
      self.fetchRotation(file)
      reader.readAsDataURL(file)
      reader.onload = function(_file) {
        let imageUrl = _file.target.result
        self.setState({ imageUrl: imageUrl })
      }
    } else {
      self.setState({ imageUrl: null })
    }
  }

  onClickUploadOverlay(event) {
    $(this.refs.fileInput).trigger('click')
  }
}
