package expo.modules.keyguard

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.PowerManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KeyguardModule : Module() {
  private var receiver: BroadcastReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("Keyguard")

    Events("onScreenOff", "onUserPresent", "onLog")

    AsyncFunction("isScreenOff") {
      val pm = appContext.reactContext?.getSystemService(Context.POWER_SERVICE) as? PowerManager
      (pm?.isInteractive ?: true).not()
    }

    OnCreate {
      val context = appContext.reactContext ?: return@OnCreate Unit
      receiver = object : BroadcastReceiver() {
        override fun onReceive(ctx: Context, intent: Intent) {
          when (intent.action) {
            Intent.ACTION_SCREEN_OFF -> {
              sendEvent("onLog", mapOf("message" to "[KeyguardModule] ACTION_SCREEN_OFF"))
              sendEvent("onScreenOff")
            }
            Intent.ACTION_USER_PRESENT -> {
              sendEvent("onLog", mapOf("message" to "[KeyguardModule] ACTION_USER_PRESENT"))
              sendEvent("onUserPresent")
            }
          }
        }
      }
      val filter = IntentFilter().apply {
        addAction(Intent.ACTION_SCREEN_OFF)
        addAction(Intent.ACTION_USER_PRESENT)
      }
      context.registerReceiver(receiver, filter)
    }

    OnDestroy {
      val context = appContext.reactContext ?: return@OnDestroy Unit
      receiver?.let { context.unregisterReceiver(it) }
      receiver = null
    }
  }
}
