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