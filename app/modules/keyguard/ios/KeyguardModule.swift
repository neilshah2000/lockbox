import ExpoModulesCore

public class KeyguardModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Keyguard")

    AsyncFunction("isDeviceLocked") { () -> Bool in
      return false
    }
  }
}
