package com.yomencity.boodie;

import com.facebook.react.ReactActivity;
import com.rnfs.RNFSPackage;  // <--- import
import android.content.Intent; // <-- include if not already there
import com.tkporter.sendsms.SendSMSPackage;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      //probably some other stuff here
      SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
  } 

  @Override
  protected String getMainComponentName() {
    return "boodie";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);  // here
      super.onCreate(savedInstanceState);
  }
}
