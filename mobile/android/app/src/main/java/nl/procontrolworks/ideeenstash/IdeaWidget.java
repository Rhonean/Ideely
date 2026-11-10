package nl.procontrolworks.ideeenstash;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import org.json.JSONObject;

/**
 * Widget "Idee van de dag". Leest wat de app via de Preferences-plugin heeft opgeslagen
 * (SharedPreferences "CapacitorStorage", sleutel "widget").
 */
public class IdeaWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) render(ctx, mgr, id);
    }

    static void render(Context ctx, AppWidgetManager mgr, int id) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_idea);
        String title = "Je idee van vandaag";
        String body = "Open Ideeënstash om je eerste stash te lezen.";
        String book = "Idee van de dag";
        String meta = "";
        try {
            String raw = ctx.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("widget", null);
            if (raw != null) {
                JSONObject o = new JSONObject(raw);
                title = o.optString("title", title);
                body = o.optString("body", body);
                String b = o.optString("book", "");
                if (!b.isEmpty()) book = b;
                meta = o.optString("goal", "");
                int streak = o.optInt("streak", 0);
                if (streak > 0) meta = meta + " · reeks " + streak;
            }
        } catch (Exception ignored) { }
        v.setTextViewText(R.id.w_book, book);
        v.setTextViewText(R.id.w_title, title);
        v.setTextViewText(R.id.w_body, body);
        v.setTextViewText(R.id.w_meta, meta);

        Intent open = new Intent(ctx, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, 0, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        v.setOnClickPendingIntent(R.id.w_root, pi);
        mgr.updateAppWidget(id, v);
    }

    public static void updateAll(Context ctx) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, IdeaWidget.class));
        for (int id : ids) render(ctx, mgr, id);
    }
}
