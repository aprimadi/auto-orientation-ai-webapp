import os
import cv2
import skimage.io
import numpy as np
from io import BytesIO
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from keras.models import load_model
from keras.preprocessing.image import img_to_array
from wand.image import Image

app = Flask(__name__)
model = load_model('models/vgg-9792.h5')
model._make_predict_function()

@app.route("/")
def home():
    return render_template('home.html')

@app.route("/images/rotation", methods=['POST'])
def images_rotation():
    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = os.path.join('tmp', filename)
    file.save(filepath)

    with Image(filename=filepath) as img:
        img.transform(resize='192x192^')
        img.crop(width=192, height=192, gravity='center')
        img_buffer = np.asarray(bytearray(img.make_blob()), dtype='uint8')

    bytesio = BytesIO(img_buffer)
    img = skimage.io.imread(bytesio)
    img = img.astype('float32')
    img /= 255

    img = np.reshape(img, (1, 192, 192, 3))
    out = model.predict(img)
    out = np.argmax(out, axis=1)
    return jsonify({ 'rotation': int(out[0]) })
