# Sport Finder

**Sport Finder** is a mobile app built with **Expo** and **React Native** that allows users to create or join local sports games.  
Users can also chat with others to coordinate and connect more easily.

## Prerequisite:

Node.js

npm

Expo installed on your mobile (IOS or Android)

## Instructions:

  1. Clone the repository to your machine.

       Web URL:
     
             git clone https://github.com/qq1157993245/Sport-Finder.git

       or SSH key:

         git clone git@github.com:qq1157993245/Sport-Finder.git

  3. Set up a map API KEY.
     
     1) Go to the [Google Cloud Console](https://console.cloud.google.com/).
        
     2) Create a new project (or use an existing one).
    
     3) Enable the following APIs:

        - Maps SDK for Android

        - Maps SDK for iOS

        - Places API

        - Geocoding API
          
      4) Go to the Credentials tab and create an API key.
    
      5) Restrict your key to only the APIs you enabled for better security (optional but recommended).
    
      6) Navigate to the `/SportFinder` folder and create a `.env` file with the following line:

            ```env
            EXPO_PUBLIC_API_KEY=your_api_key_here
            ```

  4. In the `/SportFinder` folder, run:

         npm install

  5. Run the command to start:

         npx expo start

  6. Open the Expo app on your mobile, and then scan the QR code shown in the terminal
