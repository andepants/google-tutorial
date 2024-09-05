import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
  GoogleSigninButton
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const index = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId: '1088301646462-g2nseki6dmd571ksl9kqcuof5l2d7npp.apps.googleusercontent.com',
  });

  const signIn = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token\
      const response = await GoogleSignin.signIn();

      console.log('response', response);

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(response.data?.idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      </SafeAreaView>
    )
  }

  return (
    <View style={{justifyContent:'center', flex: 1, alignItems: 'center'}}>
      <Text>Welcome {user.email}</Text>
      <TouchableOpacity onPress={() => auth().signOut()}>
        <Text>Sign-out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default index