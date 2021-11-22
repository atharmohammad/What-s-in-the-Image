"""
import libraries and functions from what's in the image 
encode the image
feed it to predict function 
return the caption
"""

import numpy as np
import pandas as pd
from tensorflow.keras.applications.resnet50 import ResNet50 , preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model,load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

import os
directory = os.getcwd()
max_len = 35

df = pd.read_csv("word_to_indx.csv")
IMG_PATH = "../Flickr_Data/Flickr_Data/Images/"

def preprocess_img(img):
    img = image.load_img(img,target_size=(224,224)) # image gets loaded as 224,224,3 
    img = image.img_to_array(img)
    img = np.expand_dims(img,axis=0) # here we reshaped the image from (224,224,3) to (1,224,224,3) 
                                    #as for resnet50 we need it in batch so image batch would be like (batch_size,224,224,3)
    
    #Normalisation according to resnet50
    img = preprocess_input(img)
    return img

word_to_idx = {}
idx_to_word = {}
model = ResNet50(weights="imagenet",input_shape=(224,224,3)) 
model_new = Model(model.input,model.layers[-2].output)
model = load_model(directory + '/model_weights/model_9.h5')

for match in df.to_numpy():
    word_to_idx[match[0]] = match[1]

cnt = 1
for match in df.to_numpy():
    if match[0] != 'startseq' and match[0] != 'endsq':
        idx_to_word[cnt] = match[0]
        cnt+=1

last_idx = len(idx_to_word)

idx_to_word[last_idx + 1] = 'startseq'
idx_to_word[last_idx + 2] = 'endseq'

def encode_img(img):
    img = preprocess_img(img)
    feature_vector = model_new.predict(img)
    feature_vector = feature_vector.reshape((-1,))
#     print(feature_vector.shape)
    return feature_vector

def predict_caption():
    photo =  encode_img(directory + "/src/at.jpg").reshape((1,2048))
    in_text = 'startseq'
    for i in range(max_len):
        sequence = [word_to_idx[w] for w in in_text.split() if w in word_to_idx]
        sequence = pad_sequences([sequence],maxlen=max_len,padding='post')
        
        ypred = model.predict([photo,sequence])
        ypred = ypred.argmax()
        word = idx_to_word[ypred]
        in_text += (' ' + word)
        
        if word == 'endseq':
            break
            
    final_caption = in_text.split()[1:-1]
    final_caption = ' '.join(final_caption)
    return final_caption

caption =  predict_caption()
print(caption)


