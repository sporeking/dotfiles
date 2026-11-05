/** Minimal Vim browsing on Pi's native fullscreen transcript and input editor. */
import { CustomEditor, type ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { matchesKey, truncateToWidth } from '@earendil-works/pi-tui';

export default function (pi: ExtensionAPI) {
  pi.on('session_start', (_event, ctx) => {
    if (ctx.mode !== 'tui') return;
    ctx.ui.setEditorComponent((tui, theme, keybindings) => {
      class VimNavigation extends CustomEditor {
        private normal = false;
        private pendingG = false;

        handleInput(data: string): void {
          if (matchesKey(data, 'escape')) {
            if (this.normal) super.handleInput(data); // second Escape retains Pi abort/cancel
            else this.normal = true;
            this.pendingG = false;
            tui.requestRender();
            return;
          }
          if (!this.normal) {
            super.handleInput(data);
            return;
          }
          if (matchesKey(data, 'i') || matchesKey(data, 'a')) {
            this.normal = false;
            this.pendingG = false;
            tui.scrollToBottom();
            tui.requestRender();
            return;
          }
          if (matchesKey(data, 'g')) {
            if (this.pendingG) tui.scrollToTop();
            this.pendingG = !this.pendingG;
            tui.requestRender();
            return;
          }
          this.pendingG = false;
          const halfPage = Math.max(1, Math.floor(tui.terminal.rows / 2));
          if (matchesKey(data, 'k')) tui.scrollBy(-1);
          else if (matchesKey(data, 'j')) tui.scrollBy(1);
          else if (matchesKey(data, 'ctrl+u')) tui.scrollBy(-halfPage);
          else if (matchesKey(data, 'ctrl+d')) tui.scrollBy(halfPage);
          else if (matchesKey(data, 'shift+g') || data === 'G') tui.scrollToBottom();
          else if (data === '/') tui.toggleSearch();
          else if (matchesKey(data, 'h')) super.handleInput('\x1b[D');
          else if (matchesKey(data, 'l')) super.handleInput('\x1b[C');
          else if (data === '0') super.handleInput('\x01');
          else if (data === '$') super.handleInput('\x05');
          else if (data.length === 1 && data.charCodeAt(0) >= 32) return;
          else super.handleInput(data); // keep Pi model/tools/queue/exit shortcuts
          tui.requestRender();
        }

        render(width: number): string[] {
          const lines = super.render(width);
          if (!lines.length) return lines;
          const label = this.normal ? ' NORMAL · j/k scroll · i input ' : ' INSERT · Esc browse ';
          const index = lines.length - 1;
          lines[index] = truncateToWidth(lines[index], Math.max(0, width - label.length), '')
            + ctx.ui.theme.fg('dim', truncateToWidth(label, width, ''));
          return lines;
        }
      }
      return new VimNavigation(tui, theme, keybindings);
    });
  });
}
