# One Degree's Mobile App v1.0

Code named _Duboce_, the mobile app consists of a basic wrapper for One
Degree's resource server of community opportunities & organizations.

## Development environment setup

### 1. Install homebrew

If not yet installed, install homebrew:

    ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"

### 2. Install node with npm package manager

    brew install node

### 3. Install Cordova / PhoneGap

    npm install -g cordova

### 4. Install Android and iOS SDKs

[Download the Android SDK here](developer.android.com/sdk/index.html) and follow the instructions for installation.

Ensure Xcode is installed.

### 5. Clone the repository

Clone the repo locally:

    git clone git@github.com:1deg/mobile-app.git

## Running (emulating) mobile apps

First build the Android package:

    cordova build (android|ios)

Then emulate it:

    cordova emulate (android|ios)

## Resource Server API

This is the [documentation for One Degree's resource server](https://data.1deg.org/docs).

## Build release packages

### Android

#### 1. Build release `apk` file

Run the Cordova build command with the release flag.

    cordova build --release android

In the following steps, reference the unsigned built package, which is probably now at `platforms/android/ant-build/Duboce-release-unsigned.apk`.

#### 2. Sign the `apk` file with certificate

Sign the release version of the `apk` file with the existing One Degree certificate (don't create a new one).

    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore PATH_TO/onedegree.keystore PATH_TO/Duboce-release-unsigned.apk onedegree

Verify signing has been successful by running:

    jarsigner -verify PATH_TO/Duboce-release-unsigned.apk

[Check the Android app signing reference](http://developer.android.com/tools/publishing/app-signing.html) if you have any questions.

#### 3. Zip align `apk` file

Before uploading the new package to the Play store, zip align the package:

    zipalign -v 4 PATH_TO/Duboce-release-unsigned.apk Duboce.apk

#### 4. Upload `apk` file to Play Store

That's it.
