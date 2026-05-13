"""
AgroVision AI — CNN Model Training Script
Dataset: PlantVillage (38 disease classes, 14 crop types)
Download dataset from: https://www.kaggle.com/datasets/emmarex/plantdisease
Place in: ml-model/dataset/PlantVillage/
"""

import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

# ── Config ──────────────────────────────────────────────────────────────────
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30
DATASET_DIR = 'dataset/PlantVillage'
MODEL_PATH = 'model.h5'

# ── Data Augmentation ────────────────────────────────────────────────────────
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    vertical_flip=False,
    fill_mode='nearest',
    validation_split=0.2,
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255, validation_split=0.2)

train_gen = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    shuffle=True,
)

val_gen = val_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=False,
)

NUM_CLASSES = len(train_gen.class_indices)
print(f"Classes found: {NUM_CLASSES}")

# ── Model (Transfer Learning: MobileNetV2) ───────────────────────────────────
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(*IMG_SIZE, 3),
    include_top=False,
    weights='imagenet',
)
base_model.trainable = False  # Freeze base initially

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(512, activation='relu'),
    layers.Dropout(0.4),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(NUM_CLASSES, activation='softmax'),
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss='categorical_crossentropy',
    metrics=['accuracy'],
)

model.summary()

# ── Callbacks ────────────────────────────────────────────────────────────────
callbacks = [
    ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_accuracy', verbose=1),
    EarlyStopping(patience=7, restore_best_weights=True, monitor='val_accuracy'),
    ReduceLROnPlateau(factor=0.3, patience=3, min_lr=1e-6, monitor='val_loss'),
]

# ── Phase 1: Train top layers ─────────────────────────────────────────────────
print("\n── Phase 1: Training top layers ──")
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=15,
    callbacks=callbacks,
)

# ── Phase 2: Fine-tune last 30 layers of base ────────────────────────────────
print("\n── Phase 2: Fine-tuning ──")
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss='categorical_crossentropy',
    metrics=['accuracy'],
)

history_fine = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS,
    initial_epoch=15,
    callbacks=callbacks,
)

# ── Save class indices ────────────────────────────────────────────────────────
import json
with open('class_indices.json', 'w') as f:
    json.dump(train_gen.class_indices, f, indent=2)

print(f"\nModel saved to {MODEL_PATH}")
print(f"Class indices saved to class_indices.json")

# ── Evaluate ──────────────────────────────────────────────────────────────────
loss, acc = model.evaluate(val_gen)
print(f"\nValidation Accuracy: {acc * 100:.2f}%")
