package nl.procontrolworks.ideely;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Brug tussen de app en de widget: de app schrijft de gegevens, deze plugin ververst de widget. */
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {
    @PluginMethod
    public void update(PluginCall call) {
        IdeaWidget.updateAll(getContext());
        call.resolve();
    }
}
