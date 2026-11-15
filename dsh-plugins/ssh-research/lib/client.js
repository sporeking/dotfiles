/* Modified for sporeking/dsh-ssh-research; see README.md and LICENSE. */
window.__ModuleLoader__.load({
  id: "@sporeking/dsh-ssh-research",
  factory(require) {
    const module = { exports: {} };
    const exports = module.exports;
    const React = require('react');
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/protocol.ts
var SSH_API_BASE = "/api/dsh-ssh";
var SSH_API = {
  hosts: SSH_API_BASE + "/hosts",
  importSshConfig: SSH_API_BASE + "/hosts/import-ssh-config",
  test: SSH_API_BASE + "/test",
  exec: SSH_API_BASE + "/exec",
  cluster: SSH_API_BASE + "/cluster",
  upload: SSH_API_BASE + "/upload",
  download: SSH_API_BASE + "/download",
  ls: SSH_API_BASE + "/ls",
  tunnel: SSH_API_BASE + "/tunnel",
  terminal: SSH_API_BASE + "/terminal"
};

// src/client/locales.ts
var zh = {
  "entry.label": "SSH",
  "entry.tooltip": "\u8FDC\u7A0B SSH \u8FD0\u7EF4\u9762\u677F",
  "panel.title": "\u8FDC\u7A0B SSH",
  "panel.backToConversation": "\u8FD4\u56DE\u4F1A\u8BDD",
  "tab.hosts": "\u4E3B\u673A",
  "tab.terminal": "\u7EC8\u7AEF",
  "tab.transfer": "\u4F20\u8F93",
  "tab.tunnels": "\u96A7\u9053",
  "tab.cluster": "\u96C6\u7FA4",
  // hosts
  "hosts.empty": "\u5C1A\u672A\u914D\u7F6E\u4E3B\u673A\u3002\u70B9\u51FB\u300C\u65B0\u589E\u4E3B\u673A\u300D\u6DFB\u52A0\uFF0C\u6216\u4ECE ~/.ssh/config \u5BFC\u5165\u3002",
  "hosts.add": "\u65B0\u589E\u4E3B\u673A",
  "hosts.import": "\u5BFC\u5165 ~/.ssh/config",
  "hosts.search": "\u641C\u7D22\u522B\u540D / \u63CF\u8FF0 / \u6807\u7B7E\u2026",
  "hosts.groupBy.label": "\u5206\u7EC4\u65B9\u5F0F",
  "hosts.groupBy.none": "\u4E0D\u5206\u7EC4",
  "hosts.groupBy.environment": "\u6309\u73AF\u5883\u5206\u7EC4",
  "hosts.groupBy.tags": "\u6309\u6807\u7B7E\u5206\u7EC4",
  "hosts.group.ungrouped": "\u672A\u8BBE\u7F6E\u73AF\u5883",
  "hosts.group.noTags": "\u65E0\u6807\u7B7E",
  "hosts.group.count": "{count} \u53F0",
  "hosts.group.testAll": "\u6D4B\u8BD5\u5168\u90E8",
  "hosts.col.alias": "\u522B\u540D",
  "hosts.col.host": "\u4E3B\u673A",
  "hosts.col.user": "\u7528\u6237",
  "hosts.col.auth": "\u8BA4\u8BC1",
  "hosts.col.environment": "\u73AF\u5883",
  "hosts.col.tags": "\u6807\u7B7E",
  "hosts.col.description": "\u5907\u6CE8",
  "hosts.col.actions": "\u64CD\u4F5C",
  "hosts.test": "\u6D4B\u8BD5",
  "hosts.edit": "\u7F16\u8F91",
  "hosts.delete": "\u5220\u9664",
  "hosts.deleteConfirm": "\u786E\u5B9A\u5220\u9664\u4E3B\u673A\u300C{alias}\u300D\uFF1F\u5C06\u540C\u65F6\u505C\u6B62\u5176\u96A7\u9053\u3002",
  "hosts.imported": "\u89E3\u6790 {parsed} \u4E2A\u914D\u7F6E\u5757\uFF0C\u65B0\u589E {added} \u53F0\u4E3B\u673A\uFF0C\u8DF3\u8FC7 {skipped} \u4E2A\u3002",
  "hosts.proxyBadge": "\u4EE3\u7406",
  "hosts.forwardAgentBadge": "Agent \u8F6C\u53D1",
  "hosts.forwardAgentHint": "\u4EC5\u5BF9\u53EF\u4FE1\u4E3B\u673A\u5F00\u542F\uFF1A\u8FDC\u7AEF\u53EF\u7528\u672C\u673A\u79C1\u94A5\u7B7E\u540D\uFF08\u7B49\u4EF7 ssh -A\uFF09\u3002",
  "import.reason.wildcard": "\u901A\u914D\u7B26 pattern\uFF0C\u9700\u624B\u52A8\u914D\u7F6E",
  "import.reason.existing": "\u522B\u540D\u5DF2\u5B58\u5728",
  "import.reason.match": "Match \u6761\u4EF6\u5757\uFF0C\u4E0D\u652F\u6301",
  "import.reason.invalid": "\u5B57\u6BB5\u4E0D\u5408\u6CD5\uFF0C\u65E0\u6CD5\u5BFC\u5165",
  "import.more": "\u5176\u4F59 {count} \u4E2A\u672A\u663E\u793A",
  "hosts.testing": "\u8FDE\u63A5\u6D4B\u8BD5\u4E2D\u2026",
  "hosts.testOk": "\u8FDE\u63A5\u6210\u529F\uFF08{latency} ms\uFF09",
  "hosts.testFail": "\u8FDE\u63A5\u5931\u8D25\uFF1A{error}",
  "hosts.connected": "\u8FDE\u63A5",
  "hosts.notConnected": "\u672A\u8FDE\u63A5",
  // host form
  "form.title.create": "\u65B0\u589E\u4E3B\u673A",
  "form.title.edit": "\u7F16\u8F91\u4E3B\u673A {alias}",
  "form.alias": "\u522B\u540D",
  "form.aliasHint": "\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u4E0E\u5355\u8FDE\u5B57\u7B26\uFF0C\u64CD\u4F5C\u65F6\u4F7F\u7528",
  "form.host": "\u4E3B\u673A\u5730\u5740",
  "form.port": "\u7AEF\u53E3",
  "form.user": "\u7528\u6237\u540D",
  "form.auth": "\u8BA4\u8BC1\u65B9\u5F0F",
  "form.auth.key": "\u5BC6\u94A5",
  "form.auth.password": "\u5BC6\u7801",
  "form.auth.agent": "SSH Agent",
  "form.agentPath": "Agent \u8DEF\u5F84",
  "form.agentPathHint": "\u7559\u7A7A\u81EA\u52A8\u68C0\u6D4B\uFF08SSH_AUTH_SOCK\uFF1BWindows \u4E0A\u4E3A\u539F\u751F ssh-agent \u547D\u540D\u7BA1\u9053\uFF09\uFF1B\u4E5F\u53EF\u586B socket \u8DEF\u5F84\u6216 pageant",
  "form.authKeepHint": "\u7F16\u8F91\u65F6\u5BC6\u7801 / \u79C1\u94A5\u7559\u7A7A\u5C06\u4FDD\u7559\u5DF2\u5B58\u51ED\u636E\uFF1BAgent \u8DEF\u5F84\u7559\u7A7A\u662F\u5408\u6CD5\u7684\u81EA\u52A8\u68C0\u6D4B\uFF0C\u9009\u300CSSH Agent\u300D\u5373\u5207\u6362\u5230 agent \u8BA4\u8BC1\u3002",
  "form.keyPath": "\u79C1\u94A5\u8DEF\u5F84",
  "form.keyPathHint": "\u5982 ~/.ssh/id_ed25519",
  "form.passphrase": "\u5BC6\u94A5\u53E3\u4EE4",
  "form.password": "\u5BC6\u7801",
  "form.passwordHint": "\u660E\u6587\u4FDD\u5B58\u5728 $DSH_HOME/dsh-ssh.json\uFF08\u672C\u673A\u79C1\u6709\u6587\u4EF6\uFF09",
  "form.passwordRequired": "\u5BC6\u7801\u8BA4\u8BC1\u9700\u8981\u586B\u5199\u5BC6\u7801\u3002",
  "form.proxyJump": "\u8DF3\u677F\u673A\u522B\u540D",
  "form.proxyJumpHint": "\u9017\u53F7\u5206\u9694\u7684\u672C\u5730\u4E3B\u673A\u522B\u540D\uFF0C\u6216 [user@]host[:port] \u5730\u5740\uFF0C\u6309\u987A\u5E8F\u8FDE\u63A5",
  "form.proxyCommand": "ProxyCommand",
  "form.proxyCommandHint": "OpenSSH ProxyCommand\uFF1A%h \u4E3B\u673A\u3001%p \u7AEF\u53E3\u3001%r \u7528\u6237\u3001%n \u522B\u540D\uFF1B\u7559\u7A7A\u6216\u586B none \u8868\u793A\u4E0D\u4F7F\u7528\u3002\u4E0E\u8DF3\u677F\u673A\u522B\u540D\u4E92\u65A5\u3002",
  "form.forwardAgent": "\u542F\u7528 Agent \u8F6C\u53D1",
  "form.forwardAgentHint": "\u628A\u672C\u673A SSH Agent \u8F6C\u53D1\u5230\u8BE5\u4E3B\u673A\uFF08\u7B49\u4EF7 ssh -A\uFF09\uFF1A\u8FDC\u7AEF\u53EF\u7528\u672C\u673A\u79C1\u94A5\u7B7E\u540D\u3002\u4EC5\u5BF9\u53EF\u4FE1\u4E3B\u673A\u5F00\u542F\u3002",
  "form.description": "\u5907\u6CE8",
  "form.environment": "\u73AF\u5883",
  "form.environmentHint": "\u5982 development / production",
  "form.tags": "\u6807\u7B7E",
  "form.tagsHint": "\u9017\u53F7\u5206\u9694",
  "form.location": "\u4F4D\u7F6E",
  "form.save": "\u4FDD\u5B58",
  "form.cancel": "\u53D6\u6D88",
  "form.required": "\u8BF7\u586B\u5199\u5FC5\u586B\u5B57\u6BB5\uFF1A\u522B\u540D\u3001\u4E3B\u673A\u5730\u5740\u3001\u7528\u6237\u540D\u3002",
  "form.portInvalid": "\u7AEF\u53E3\u5FC5\u987B\u662F 1-65535 \u4E4B\u95F4\u7684\u6574\u6570\u3002",
  // terminal
  "terminal.selectHost": "\u9009\u62E9\u4E3B\u673A",
  "terminal.connect": "\u8FDE\u63A5",
  "terminal.disconnect": "\u65AD\u5F00",
  "terminal.placeholder": "\u9009\u62E9\u4E3B\u673A\u540E\u70B9\u51FB\u300C\u8FDE\u63A5\u300D\u6253\u5F00\u8FDC\u7A0B\u7EC8\u7AEF\u3002",
  "terminal.connecting": "\u6B63\u5728\u8FDE\u63A5\u2026",
  "terminal.ready": "\u7EC8\u7AEF\u5DF2\u8FDE\u63A5\uFF08{alias}\uFF09",
  "terminal.exited": "\u7EC8\u7AEF\u5DF2\u9000\u51FA\uFF08{alias}\uFF09",
  "terminal.error": "\u7EC8\u7AEF\u9519\u8BEF\uFF1A{error}",
  "terminal.noWebSocket": "\u5F53\u524D\u9875\u9762\u4E0D\u652F\u6301 WebSocket\uFF08\u5E94\u7528\u5916\u58F3\u6CA1\u6709\u53EF\u8FDE\u63A5\u7684\u672C\u5730\u4E3B\u673A\u5730\u5740\uFF09\uFF0C\u8BF7\u6539\u7528\u6D4F\u89C8\u5668\u6253\u5F00\u7684 Web \u754C\u9762\u4F7F\u7528\u7EC8\u7AEF\u3002",
  "terminal.auth.title": "\u4E8C\u6B21\u8EAB\u4EFD\u9A8C\u8BC1 (2FA / \u4EA4\u4E92\u5F0F\u8BA4\u8BC1)",
  "terminal.auth.submit": "\u63D0\u4EA4\u9A8C\u8BC1\u7801",
  "terminal.auth.cancel": "\u53D6\u6D88",
  "terminal.auth.placeholder": "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801\u6216\u53E3\u4EE4",
  "terminal.auth.hint": "\u670D\u52A1\u5668\u8BF7\u6C42\u8FDB\u884C\u4EA4\u4E92\u5F0F\u4E8C\u6B21\u9A8C\u8BC1\uFF08\u8F93\u5165\u4EC5\u672C\u6B21\u751F\u6548\uFF0C\u4E0D\u843D\u76D8\uFF09\uFF1A",
  "terminal.tabs": "\u7EC8\u7AEF\u6807\u7B7E",
  "terminal.newTab": "\u6309\u5F53\u524D\u4E3B\u673A\u65B0\u5F00\u6807\u7B7E",
  "terminal.closeTab": "\u5173\u95ED\u6807\u7B7E",
  "terminal.authPending": "\u5F85\u9A8C\u8BC1",
  "terminal.tabExited": "\u5DF2\u9000\u51FA",
  "terminal.tabError": "\u51FA\u9519",
  "terminal.closeFailed": "\u65E0\u6CD5\u786E\u8BA4\u8BE5\u6807\u7B7E\u5DF2\u5173\u95ED\uFF1A\u5173\u95ED\u5E27\u672A\u9001\u8FBE\u5BBF\u4E3B\u3002\u6807\u7B7E\u5DF2\u4FDD\u7559\u2014\u2014\u53EF\u91CD\u8BD5\uFF0C\u6216\u5207\u5230\u8BE5\u6807\u7B7E\u524D\u53F0\uFF0C\u7528\u5B83\u81EA\u5DF1\u7684\u8FDE\u63A5\u5173\u95ED\u3002",
  // transfer
  "transfer.selectHost": "\u9009\u62E9\u4E3B\u673A",
  "transfer.remotePath": "\u8FDC\u7A0B\u8DEF\u5F84",
  "transfer.remotePathHint": "\u5982 /tmp/ \u6216 /home/user/app.tar.gz",
  "transfer.upload": "\u4E0A\u4F20",
  "transfer.uploading": "\u6B63\u5728\u4E0A\u4F20 {file}\u2026",
  "transfer.download": "\u4E0B\u8F7D",
  "transfer.downloading": "\u6B63\u5728\u4E0B\u8F7D\u2026",
  "transfer.done": "\u5B8C\u6210\uFF1A{bytes} \u5B57\u8282",
  "transfer.failed": "\u4F20\u8F93\u5931\u8D25\uFF1A{error}",
  "transfer.browseRemote": "\u6D4F\u89C8\u8FDC\u7A0B\u76EE\u5F55",
  "transfer.refresh": "\u5237\u65B0",
  "transfer.name": "\u540D\u79F0",
  "transfer.upLevel": "\u4E0A\u7EA7\u76EE\u5F55",
  "transfer.size": "\u5927\u5C0F",
  "transfer.modified": "\u4FEE\u6539\u65F6\u95F4",
  "transfer.bytes": "{value} B",
  "transfer.kib": "{value} KB",
  "transfer.mib": "{value} MB",
  "transfer.gib": "{value} GB",
  "transfer.percent": "{value}%",
  "transfer.speed": "{value}/s",
  "transfer.dir": "\u76EE\u5F55",
  "transfer.file": "\u6587\u4EF6",
  // tunnels
  "tunnel.empty": "\u6CA1\u6709\u6D3B\u8DC3\u7684\u96A7\u9053\u3002",
  "tunnel.webServices": "\u6253\u5F00\u5B9E\u9A8C\u670D\u52A1\u6620\u5C04",
  "tunnel.webHint": "\u8FDC\u7A0B\u6D4F\u89C8\u5668\u4E0D\u80FD\u76F4\u63A5\u8BBF\u95EE DSH \u4E3B\u673A\u7684 127.0.0.1 \u7AEF\u53E3\u3002\u521B\u5EFA\u96A7\u9053\u540E\uFF0C\u53EF\u5728\u670D\u52A1\u6620\u5C04\u9875\u5C06\u8BE5\u672C\u5730\u7AEF\u53E3\u6620\u5C04\u5230\u5F53\u524D DSH \u5730\u5740\u3002\u9700\u8981\u7BA1\u7406\u5458\u914D\u7F6E\uFF1B\u53EA\u6620\u5C04\u53EF\u4FE1\u5E94\u7528\uFF0CNotebook/WebSocket \u517C\u5BB9\u6027\u9700\u53E6\u884C\u9A8C\u8BC1\u3002",
  "tunnel.start": "\u65B0\u5EFA\u96A7\u9053",
  "tunnel.alias": "\u4E3B\u673A\u522B\u540D",
  "tunnel.remotePort": "\u8FDC\u7A0B\u7AEF\u53E3",
  "tunnel.remoteHost": "\u8FDC\u7A0B\u4E3B\u673A",
  "tunnel.remoteHostHint": "\u9ED8\u8BA4 127.0.0.1\uFF08\u670D\u52A1\u5668\u81EA\u8EAB\uFF09",
  "tunnel.localPort": "\u672C\u5730\u7AEF\u53E3",
  "tunnel.localPortHint": "\u7559\u7A7A\u81EA\u52A8\u5206\u914D",
  "tunnel.stop": "\u505C\u6B62",
  "tunnel.stopAll": "\u5168\u90E8\u505C\u6B62",
  "tunnel.stopAllConfirm": "\u786E\u5B9A\u505C\u6B62\u5168\u90E8\u96A7\u9053\u5417\uFF1F",
  "tunnel.row": "{alias}: 127.0.0.1:{localPort} -> {remoteHost}:{remotePort}",
  "tunnel.started": "\u96A7\u9053\u5DF2\u5EFA\u7ACB\uFF1A127.0.0.1:{localPort}",
  "tunnel.failed": "\u96A7\u9053\u542F\u52A8\u5931\u8D25\uFF1A{error}",
  // cluster
  "cluster.command": "\u547D\u4EE4",
  "cluster.run": "\u6267\u884C",
  "cluster.confirm": "\u786E\u5B9A\u5728\u5339\u914D\u7684\u4E3B\u673A\u4E0A\u6267\u884C\u8BE5\u547D\u4EE4\u5417\uFF1F\u8BE5\u64CD\u4F5C\u4F1A\u771F\u5B9E\u8FD0\u884C\u5728\u8FDC\u7A0B\u670D\u52A1\u5668\u4E0A\u3002",
  "cluster.aliases": "\u4E3B\u673A\u522B\u540D\uFF08\u9017\u53F7\u5206\u9694\uFF0C\u4E0E\u73AF\u5883\u3001\u6807\u7B7E\u81F3\u5C11\u586B\u4E00\u9879\uFF09",
  "cluster.environment": "\u73AF\u5883\u8FC7\u6EE4",
  "cluster.tags": "\u6807\u7B7E\u8FC7\u6EE4\uFF08\u9017\u53F7\u5206\u9694\uFF09",
  "cluster.results": "\u6267\u884C\u7ED3\u679C",
  "cluster.empty": "\u8F93\u5165\u547D\u4EE4\u540E\u70B9\u51FB\u300C\u6267\u884C\u300D\u3002",
  "cluster.noMatch": "\u6CA1\u6709\u5339\u914D\u7684\u4E3B\u673A\u3002",
  "cluster.ok": "\u6210\u529F",
  "cluster.fail": "\u5931\u8D25",
  "cluster.timeout": "\u8D85\u65F6",
  "cluster.col.alias": "\u4E3B\u673A",
  "cluster.col.status": "\u72B6\u6001",
  "cluster.col.exit": "\u9000\u51FA\u7801",
  "cluster.col.stdout": "\u6807\u51C6\u8F93\u51FA",
  "cluster.col.stderr": "\u6807\u51C6\u9519\u8BEF",
  "cluster.col.error": "\u9519\u8BEF",
  "cluster.col.duration": "\u8017\u65F6",
  // common
  "common.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "common.error": "\u51FA\u9519\uFF1A{error}",
  "common.refresh": "\u5237\u65B0",
  "common.confirm": "\u786E\u5B9A",
  "error.disabled": "SSH \u63D2\u4EF6\u5728\u5BBF\u4E3B\u7AEF\u672A\u542F\u7528\u3002\u8BF7\u524D\u5F80\u300C\u8BBE\u7F6E \u2192 Web \u63D2\u4EF6 \u2192 SSH\u300D\u6253\u5F00 enabled \u5F00\u5173\u3002"
};
var en = {
  "entry.label": "SSH",
  "entry.tooltip": "Remote SSH operations panel",
  "panel.title": "Remote SSH",
  "panel.backToConversation": "Back to chat",
  "tab.hosts": "Hosts",
  "tab.terminal": "Terminal",
  "tab.transfer": "Transfer",
  "tab.tunnels": "Tunnels",
  "tab.cluster": "Cluster",
  "hosts.empty": 'No hosts configured. Click "Add host" or import from ~/.ssh/config.',
  "hosts.add": "Add host",
  "hosts.import": "Import ~/.ssh/config",
  "hosts.search": "Search alias / description / tags\u2026",
  "hosts.groupBy.label": "Group by",
  "hosts.groupBy.none": "No grouping",
  "hosts.groupBy.environment": "Group by environment",
  "hosts.groupBy.tags": "Group by tags",
  "hosts.group.ungrouped": "No environment",
  "hosts.group.noTags": "No tags",
  "hosts.group.count": "{count} hosts",
  "hosts.group.testAll": "Test all",
  "hosts.col.alias": "Alias",
  "hosts.col.host": "Host",
  "hosts.col.user": "User",
  "hosts.col.auth": "Auth",
  "hosts.col.environment": "Environment",
  "hosts.col.tags": "Tags",
  "hosts.col.description": "Description",
  "hosts.col.actions": "Actions",
  "hosts.test": "Test",
  "hosts.edit": "Edit",
  "hosts.delete": "Delete",
  "hosts.deleteConfirm": 'Delete host "{alias}"? Its tunnels will be stopped.',
  "hosts.imported": "Parsed {parsed} blocks, added {added} hosts, skipped {skipped}.",
  "hosts.proxyBadge": "proxy",
  "hosts.forwardAgentBadge": "agent-fwd",
  "hosts.forwardAgentHint": "Enable only for hosts you trust: the remote can sign with your local private keys (equivalent to ssh -A).",
  "import.reason.wildcard": "wildcard pattern \u2014 configure it by hand",
  "import.reason.existing": "alias already configured",
  "import.reason.match": "Match block \u2014 not supported",
  "import.reason.invalid": "invalid fields \u2014 not imported",
  "import.more": "{count} more not shown",
  "hosts.testing": "Testing connection\u2026",
  "hosts.testOk": "Connected ({latency} ms)",
  "hosts.testFail": "Connection failed: {error}",
  "hosts.connected": "Connect",
  "hosts.notConnected": "Not connected",
  "form.title.create": "Add host",
  "form.title.edit": "Edit host {alias}",
  "form.alias": "Alias",
  "form.aliasHint": "Lowercase letters, digits and single hyphens; used in every operation",
  "form.host": "Host",
  "form.port": "Port",
  "form.user": "User",
  "form.auth": "Authentication",
  "form.auth.key": "Key",
  "form.auth.password": "Password",
  "form.auth.agent": "SSH Agent",
  "form.agentPath": "Agent path",
  "form.agentPathHint": 'Leave empty to auto-detect (SSH_AUTH_SOCK; the native ssh-agent named pipe on Windows), or set a socket path or "pageant"',
  "form.authKeepHint": "While editing, an empty password or key field keeps the stored credential; an empty agent path is a valid auto-detect, so choosing SSH Agent switches the host to agent auth.",
  "form.keyPath": "Private key path",
  "form.keyPathHint": "e.g. ~/.ssh/id_ed25519",
  "form.passphrase": "Key passphrase",
  "form.password": "Password",
  "form.passwordHint": "Stored in plaintext in $DSH_HOME/dsh-ssh.json (private local file)",
  "form.passwordRequired": "Password auth requires a password.",
  "form.proxyJump": "Jump host aliases",
  "form.proxyJumpHint": "Comma-separated local aliases or [user@]host[:port] addresses, chained in order",
  "form.proxyCommand": "ProxyCommand",
  "form.proxyCommandHint": "OpenSSH ProxyCommand: %h host, %p port, %r user, %n alias; empty or none disables it. Mutually exclusive with the jump chain.",
  "form.forwardAgent": "Enable agent forwarding",
  "form.forwardAgentHint": "Forward your local SSH agent to this host (equivalent to ssh -A): the remote can sign with your private keys. Enable it only for hosts you trust.",
  "form.description": "Description",
  "form.environment": "Environment",
  "form.environmentHint": "e.g. development / production",
  "form.tags": "Tags",
  "form.tagsHint": "Comma-separated",
  "form.location": "Location",
  "form.save": "Save",
  "form.cancel": "Cancel",
  "form.required": "Required fields missing: alias, host, user.",
  "form.portInvalid": "Port must be an integer between 1 and 65535.",
  "terminal.selectHost": "Select host",
  "terminal.connect": "Connect",
  "terminal.disconnect": "Disconnect",
  "terminal.placeholder": 'Select a host and click "Connect" to open the remote terminal.',
  "terminal.connecting": "Connecting\u2026",
  "terminal.ready": "Terminal connected ({alias})",
  "terminal.exited": "Terminal exited ({alias})",
  "terminal.error": "Terminal error: {error}",
  "terminal.noWebSocket": "This page cannot carry a WebSocket (the application shell published no local host address to reach). Open the Web UI in a browser to use the terminal.",
  "terminal.auth.title": "Two-Factor Authentication (2FA)",
  "terminal.auth.submit": "Submit Code",
  "terminal.auth.cancel": "Cancel",
  "terminal.auth.placeholder": "Enter code or passphrase",
  "terminal.auth.hint": "The server requested interactive 2FA (session only, never saved):",
  "terminal.tabs": "Terminal tabs",
  "terminal.newTab": "New tab on the current host",
  "terminal.closeTab": "Close tab",
  "terminal.authPending": "2FA pending",
  "terminal.tabExited": "exited",
  "terminal.tabError": "error",
  "terminal.closeFailed": "Could not confirm the tab closed: the close never reached the host, so the tab was kept. Retry, or bring the tab to the front and close it over its own connection.",
  "transfer.selectHost": "Select host",
  "transfer.remotePath": "Remote path",
  "transfer.remotePathHint": "e.g. /tmp/ or /home/user/app.tar.gz",
  "transfer.upload": "Upload",
  "transfer.uploading": "Uploading {file}\u2026",
  "transfer.download": "Download",
  "transfer.downloading": "Downloading\u2026",
  "transfer.done": "Done: {bytes} bytes",
  "transfer.failed": "Transfer failed: {error}",
  "transfer.browseRemote": "Browse remote",
  "transfer.refresh": "Refresh",
  "transfer.name": "Name",
  "transfer.upLevel": "Parent directory",
  "transfer.size": "Size",
  "transfer.modified": "Modified",
  "transfer.bytes": "{value} B",
  "transfer.kib": "{value} KB",
  "transfer.mib": "{value} MB",
  "transfer.gib": "{value} GB",
  "transfer.percent": "{value}%",
  "transfer.speed": "{value}/s",
  "transfer.dir": "Directory",
  "transfer.file": "File",
  "tunnel.empty": "No active tunnels.",
  "tunnel.webServices": "Open experiment service mappings",
  "tunnel.webHint": "A remote browser cannot access the DSH host\u2019s 127.0.0.1 ports directly. After creating a tunnel, use service mappings to expose its local port through this DSH address. Administrator setup is required. Map trusted apps only; Notebook/WebSocket compatibility needs separate verification.",
  "tunnel.start": "New tunnel",
  "tunnel.alias": "Host alias",
  "tunnel.remotePort": "Remote port",
  "tunnel.remoteHost": "Remote host",
  "tunnel.remoteHostHint": "Default 127.0.0.1 (the server itself)",
  "tunnel.localPort": "Local port",
  "tunnel.localPortHint": "Leave empty for auto-assign",
  "tunnel.stop": "Stop",
  "tunnel.stopAll": "Stop all",
  "tunnel.stopAllConfirm": "Stop all tunnels?",
  "tunnel.row": "{alias}: 127.0.0.1:{localPort} -> {remoteHost}:{remotePort}",
  "tunnel.started": "Tunnel up: 127.0.0.1:{localPort}",
  "tunnel.failed": "Tunnel failed: {error}",
  "cluster.command": "Command",
  "cluster.run": "Run",
  "cluster.confirm": "Run this command on the matching hosts? It executes for real on the remote servers.",
  "cluster.aliases": "Host aliases (comma-separated; require at least one filter)",
  "cluster.environment": "Environment filter",
  "cluster.tags": "Tag filter (comma-separated)",
  "cluster.results": "Results",
  "cluster.empty": 'Type a command and click "Run".',
  "cluster.noMatch": "No hosts matched.",
  "cluster.ok": "OK",
  "cluster.fail": "Failed",
  "cluster.timeout": "Timed out",
  "cluster.col.alias": "Host",
  "cluster.col.status": "Status",
  "cluster.col.exit": "Exit",
  "cluster.col.stdout": "Stdout",
  "cluster.col.stderr": "Stderr",
  "cluster.col.error": "Error",
  "cluster.col.duration": "Duration",
  "common.loading": "Loading\u2026",
  "common.error": "Error: {error}",
  "common.refresh": "Refresh",
  "common.confirm": "Confirm",
  "error.disabled": "The SSH plugin is disabled on the host. Please enable it in Settings \u2192 Web Plugins \u2192 SSH."
};
function t(dictionary2, key, values) {
  let text = dictionary2[key] ?? key;
  if (values !== void 0) {
    for (const [name, value] of Object.entries(values)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

// src/client/panel/helpers.ts
function dictionary() {
  const lang = typeof document !== "undefined" ? document.documentElement.lang : "zh";
  return lang.toLowerCase().startsWith("en") ? { ...en } : { ...zh };
}
var runtimeT;
function setRuntimeTranslate(t2) {
  runtimeT = t2;
}
function tt(key, values) {
  if (runtimeT !== void 0) return runtimeT(key, values);
  return t(dictionary(), key, values);
}
function errorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
var TERMINAL_FONT_FALLBACK = 'Menlo, Consolas, "Liberation Mono", monospace';
function resolveTerminalFontFamily(override) {
  const trimmed = override?.trim();
  if (trimmed !== void 0 && trimmed !== "") return trimmed;
  if (typeof getComputedStyle === "function" && typeof document !== "undefined") {
    const target = document.body ?? document.documentElement;
    const style = getComputedStyle(target);
    for (const name of ["--dsh-ssh-terminal-font", "--ds-font-family-code"]) {
      const value = style.getPropertyValue(name).trim();
      if (value !== "") return value;
    }
  }
  return TERMINAL_FONT_FALLBACK;
}

// src/client/api.ts
var SshApiError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SshApiError";
  }
};
function extractError(text) {
  if (text === "") return void 0;
  try {
    const parsed = JSON.parse(text);
    return typeof parsed?.error === "string" ? parsed.error : void 0;
  } catch {
    return void 0;
  }
}
async function readJson(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    if (response.status === 404) {
      throw new SshApiError(tt("error.disabled"));
    }
    throw new SshApiError(`HTTP ${response.status}: invalid JSON response`);
  }
  if (!response.ok) {
    const message = typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : response.status === 404 ? tt("error.disabled") : `HTTP ${response.status}`;
    throw new SshApiError(message);
  }
  return body;
}
function query(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== void 0 && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text === "" ? "" : "?" + text;
}
function terminalSocketUrl(location, search, streamBaseUrl) {
  if (WEB_PAGE_PROTOCOLS.includes(location.protocol)) {
    const scheme2 = location.protocol === "https:" ? "wss" : "ws";
    return scheme2 + "://" + location.host + SSH_API.terminal + search;
  }
  const base = hostAuthorityOf(streamBaseUrl);
  if (base === void 0) return void 0;
  const scheme = base.protocol === "https:" ? "wss" : "ws";
  return scheme + "://" + base.authority + SSH_API.terminal + search;
}
function hostAuthorityOf(base) {
  if (base === void 0 || base === "") return void 0;
  let url;
  try {
    url = new URL(base);
  } catch {
    return void 0;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return void 0;
  if (url.username !== "" || url.password !== "") return void 0;
  if (url.host === "") return void 0;
  return { protocol: url.protocol, authority: url.host };
}
function transportStreamBaseUrl(globals = globalThis) {
  const published = globals.__DSH_TRANSPORT__?.streamBaseUrl;
  return typeof published === "string" ? published : void 0;
}
var WEB_PAGE_PROTOCOLS = [
  "http:",
  "https:",
  "blob:",
  "data:",
  "about:",
  "filesystem:"
];
function failedTerminal(reason) {
  const connection = {
    onReady: void 0,
    onOutput: void 0,
    onExit: void 0,
    onAuthPrompt: void 0,
    send: () => void 0,
    resize: () => void 0,
    sendAuthResponse: () => void 0,
    detach: () => void 0,
    close: () => void 0
  };
  queueMicrotask(() => {
    connection.onExit?.(null, reason);
  });
  return connection;
}
var SshApi = class {
  // -------------------------------------------------------------- hosts
  async listHosts(queryText) {
    const response = await fetch(SSH_API.hosts + query({ query: queryText }));
    const body = await readJson(response);
    return body.hosts;
  }
  async createHost(payload) {
    const response = await fetch(SSH_API.hosts, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await readJson(response);
    return body.host;
  }
  async updateHost(alias, patch) {
    const response = await fetch(SSH_API.hosts + query({ alias }), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch)
    });
    const body = await readJson(response);
    return body.host;
  }
  async deleteHost(alias) {
    const response = await fetch(SSH_API.hosts + query({ alias }), { method: "DELETE" });
    await readJson(response);
  }
  async importSshConfig() {
    const response = await fetch(SSH_API.importSshConfig, { method: "POST" });
    const body = await readJson(response);
    return body.result;
  }
  // ---------------------------------------------------------------- ops
  async testHost(alias) {
    const response = await fetch(SSH_API.test, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ alias })
    });
    const body = await readJson(response);
    return body.result;
  }
  async exec(alias, command, timeoutMs) {
    const response = await fetch(SSH_API.exec, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ alias, command, timeoutMs })
    });
    const body = await readJson(response);
    return body.result;
  }
  async cluster(options) {
    const response = await fetch(SSH_API.cluster, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(options)
    });
    const body = await readJson(response);
    return body.results;
  }
  // ----------------------------------------------------------------- ls
  async ls(alias, path) {
    const response = await fetch(SSH_API.ls + query({ alias, path }));
    const body = await readJson(response);
    return body.entries;
  }
  // ------------------------------------------------------------- tunnel
  async listTunnels() {
    const response = await fetch(SSH_API.tunnel, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "list" })
    });
    const body = await readJson(response);
    return body.tunnels;
  }
  async startTunnel(options) {
    const response = await fetch(SSH_API.tunnel, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "start", ...options })
    });
    const body = await readJson(response);
    return body.tunnel;
  }
  async stopTunnel(tunnelId) {
    const response = await fetch(SSH_API.tunnel, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "stop", tunnelId })
    });
    const body = await readJson(response);
    return body.ok;
  }
  async stopAllTunnels(alias) {
    const response = await fetch(SSH_API.tunnel, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "stop-all", alias })
    });
    const body = await readJson(response);
    return body.stopped;
  }
  // ------------------------------------------------------------ transfer
  /**
   * Upload one file (raw bytes) to a remote path. Progress arrives through
   * the NDJSON response stream; resolves when the result frame lands.
   */
  async uploadFile(file, alias, remotePath, onProgress) {
    const response = await fetch(SSH_API.upload + query({ alias, remotePath }), {
      method: "POST",
      body: file
    });
    if (!response.ok || response.body === null) {
      const text = await response.text().catch(() => "");
      const error = extractError(text);
      throw new SshApiError(error ?? `upload failed: HTTP ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalError;
    let sawResult = false;
    let transferredBytes = 0;
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.trim() === "") continue;
        let parsed;
        try {
          parsed = JSON.parse(line);
        } catch {
          continue;
        }
        if (parsed.type === "progress") {
          onProgress?.(parsed.progress);
        } else if (parsed.type === "result") {
          sawResult = true;
          if (parsed.ok) transferredBytes = parsed.transferredBytes ?? 0;
          finalError = parsed.ok ? void 0 : parsed.error ?? "upload failed";
        }
      }
    }
    if (finalError !== void 0) throw new SshApiError(finalError);
    if (!sawResult) throw new SshApiError("upload ended without a result frame \u2014 the transfer did not complete");
    return { transferredBytes };
  }
  /**
   * Download a remote file with client-side progress. Streams straight to
   * disk when the File System Access API is available (no full-file RAM
   * copy); otherwise falls back to an in-memory Blob.
   */
  async downloadFile(alias, remotePath, onProgress) {
    const response = await fetch(SSH_API.download + query({ alias, remotePath }));
    if (!response.ok || response.body === null) {
      const text = await response.text().catch(() => "");
      const error = extractError(text);
      throw new SshApiError(error ?? `download failed: HTTP ${response.status}`);
    }
    const total = Number(response.headers.get("content-length") ?? "0");
    const disposition = response.headers.get("content-disposition") ?? "";
    const match = /filename="([^"]+)"/.exec(disposition);
    const filename = match?.[1] ?? remotePath.split("/").pop() ?? "download";
    const reader = response.body.getReader();
    const picker = typeof window !== "undefined" ? window.showSaveFilePicker : void 0;
    let streamed = false;
    let writable;
    const chunks = [];
    let received = 0;
    const progress = () => {
      onProgress?.({
        phase: "transferring",
        file: remotePath,
        transferred: received,
        total,
        percent: total > 0 ? Math.round(received / total * 1e3) / 10 : 0
      });
    };
    try {
      if (picker !== void 0) {
        const handle = await picker.call(window, { suggestedName: filename });
        writable = await handle.createWritable();
        streamed = true;
      }
    } catch {
    }
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      if (writable !== void 0) {
        await writable.write(value);
      } else {
        chunks.push(value);
      }
      received += value.length;
      progress();
    }
    if (writable !== void 0) await writable.close();
    onProgress?.({ phase: "done", file: remotePath, transferred: received, total: received > 0 ? received : total, percent: 100 });
    return {
      blob: streamed ? void 0 : new Blob(chunks),
      filename,
      streamed,
      bytes: received
    };
  }
  // ------------------------------------------------------------ terminal
  /**
   * Open a new host terminal session for the alias.
   * @param alias - the configured host alias.
   * @param cols - initial PTY width.
   * @param rows - initial PTY height.
   * @returns the live connection; its ready callback carries the session id
   *   {@link attachTerminal} uses after a view detach.
   */
  openTerminal(alias, cols, rows) {
    return this.terminalSocket(query({ alias, cols, rows }));
  }
  /**
   * Reattach to a host-side session that outlived its view (a panel switch, a
   * page navigation). The host replays its scrollback before the ready frame.
   * @param sessionId - the id the previous connection reported on ready.
   * @param cols - the view's current width.
   * @param rows - the view's current height.
   */
  attachTerminal(sessionId, cols, rows) {
    return this.terminalSocket(query({ session: sessionId, cols, rows }));
  }
  /**
   * End a host session this view is not attached to (closing a background
   * tab). The session has no other handle from the browser: giving it a
   * dedicated HTTP route would widen the host's surface for one frame, so this
   * opens one short-lived attach instead and sends the close frame as soon as
   * the socket is open.
   *
   * The answer is "is this session no longer running", which has three
   * truthful answers and one lie to avoid:
   *   - the frame went out on an open socket: the host ends the session;
   *   - the host answered with an exit frame: an unknown id is reported as
   *     `terminal session expired` and an ended shell also exits, and in both
   *     cases nothing is running, so the tab really is closed;
   *   - the socket errored, closed before opening, or never settled inside
   *     `timeoutMs`: delivery is unproven, so the session may still be alive and
   *     the caller must keep the tab instead of claiming it closed.
   * @param sessionId - the session id the host reported on its ready frame.
   * @param timeoutMs - bounded wait for the delivery signal (default 5000).
   * @returns true when the session is known to be gone.
   */
  closeTerminalSession(sessionId, timeoutMs = 5e3) {
    const target = terminalSocketUrl(
      window.location,
      query({ session: sessionId, cols: 2, rows: 1 }),
      transportStreamBaseUrl()
    );
    if (target === void 0) return Promise.resolve(false);
    let socket;
    try {
      socket = new WebSocket(target);
    } catch {
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      let settled = false;
      let timer;
      const finish = (gone) => {
        if (settled) return;
        settled = true;
        if (timer !== void 0) clearTimeout(timer);
        try {
          socket.close();
        } catch {
        }
        resolve(gone);
      };
      timer = setTimeout(() => {
        finish(false);
      }, timeoutMs);
      socket.onopen = () => {
        const closeFrame = { type: "close" };
        try {
          socket.send(JSON.stringify(closeFrame));
          finish(true);
        } catch {
        }
      };
      socket.onmessage = (event) => {
        let frame;
        try {
          frame = JSON.parse(event.data);
        } catch {
          return;
        }
        if (frame.type === "exit") finish(true);
      };
      socket.onerror = () => {
        finish(false);
      };
      socket.onclose = () => {
        finish(false);
      };
    });
  }
  /** One terminal socket over either an alias (open) or a session id (attach). */
  terminalSocket(search) {
    const target = terminalSocketUrl(window.location, search, transportStreamBaseUrl());
    if (target === void 0) {
      return failedTerminal(tt("terminal.noWebSocket"));
    }
    let socket;
    try {
      socket = new WebSocket(target);
    } catch (error) {
      return failedTerminal(error instanceof Error ? error.message : String(error));
    }
    let leaving = false;
    const sendFrame = (frame) => {
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(frame));
    };
    const connection = {
      onReady: void 0,
      onOutput: void 0,
      onExit: void 0,
      onAuthPrompt: void 0,
      send: (data) => {
        sendFrame({ type: "input", data });
      },
      resize: (cols, rows) => {
        sendFrame({ type: "resize", cols, rows });
      },
      sendAuthResponse: (responses) => {
        sendFrame({ type: "auth_response", responses });
      },
      detach: () => {
        leaving = true;
        sendFrame({ type: "detach" });
        try {
          socket.close();
        } catch {
        }
      },
      close: () => {
        leaving = true;
        sendFrame({ type: "close" });
        try {
          socket.close();
        } catch {
        }
      }
    };
    socket.onmessage = (event) => {
      let frame;
      try {
        frame = JSON.parse(event.data);
      } catch {
        return;
      }
      if (frame.type === "ready") connection.onReady?.(frame.sessionId, frame.alias);
      else if (frame.type === "output") connection.onOutput?.(frame.data);
      else if (frame.type === "exit") connection.onExit?.(frame.code, frame.error);
      else if (frame.type === "auth_prompt") connection.onAuthPrompt?.(frame.name, frame.instructions, frame.prompts);
    };
    socket.onclose = () => {
      if (!leaving) connection.onExit?.(null, "connection closed");
    };
    socket.onerror = () => {
      if (!leaving) connection.onExit?.(null, "connection error");
    };
    return connection;
  }
};

// src/client/panel/controller.ts
var SSH_PANEL_ID = "ssh";
var MAX_RETAINED_BYTES = 256 * 1024;
function utf8Bytes(text) {
  let bytes = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    bytes += code < 128 ? 1 : code < 2048 ? 2 : code < 65536 ? 3 : 4;
  }
  return bytes;
}
var PanelController = class {
  constructor(deps = {}) {
    this.deps = deps;
  }
  deps;
  panelOpen = false;
  activeTab = "hosts";
  terminalTabs = [];
  activeTerminalTabId;
  draftAlias = "";
  nextTerminalTabSeq = 0;
  listeners = /* @__PURE__ */ new Set();
  /**
   * Last screen of each tab, kept outside the snapshot: terminal output must
   * not re-render the panel on every chunk, and only the terminal view reads
   * this (when a tab has no session left to replay from).
   */
  retainedScreens = /* @__PURE__ */ new Map();
  /**
   * Sockets that outlived their view while still connecting. Their session id
   * is unknown, so they cannot be detached yet; keeping them here is what
   * prevents a host PTY with no owner.
   */
  adoptedLinks = /* @__PURE__ */ new Map();
  /** Cached so getSnapshot is referentially stable between changes. */
  snapshot = {
    panelOpen: false,
    activeTab: "hosts",
    terminalTabs: [],
    activeTerminalTabId: void 0,
    draftAlias: ""
  };
  getSnapshot() {
    return this.snapshot;
  }
  subscribe(fn2) {
    this.listeners.add(fn2);
    return () => {
      this.listeners.delete(fn2);
    };
  }
  /**
   * Show the panel. The layout owns which panel the column renders, so the
   * state flip and the selection travel together; the selection is requested
   * after the snapshot flips, so a subscriber never observes "open" while the
   * shell still shows the conversation.
   */
  open() {
    if (this.panelOpen) return;
    this.panelOpen = true;
    this.commit();
    this.selectPanel(SSH_PANEL_ID);
  }
  /** Return the column to the conversation, asking the layout explicitly. */
  close() {
    if (!this.panelOpen) return;
    this.panelOpen = false;
    this.commit();
    this.selectPanel(null);
  }
  toggle() {
    if (this.panelOpen) this.close();
    else this.open();
  }
  /**
   * Reflect a selection made outside this controller (the user clicked another
   * sidebar row, or the layout dropped the panel id).
   * @param panelId - the layout's current panel id, or null for the conversation.
   */
  syncPanelSelection(panelId) {
    const open = panelId === SSH_PANEL_ID;
    if (open === this.panelOpen) return;
    this.panelOpen = open;
    this.commit();
  }
  /** Switch tabs, keeping every other piece of view state. */
  setActiveTab(tab) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.commit();
  }
  /**
   * Hand the terminal tab a host to connect to (the hosts-tab "connect"
   * action): the tab exists before the view does, so a panel switch during the
   * handshake still shows the connecting tab and adopts its socket.
   * @param alias - the configured host alias.
   */
  requestConnect(alias) {
    this.activeTab = "terminal";
    this.openTerminalTab(alias);
  }
  /**
   * Add a terminal tab on the alias and make it the shown one. Several tabs
   * may target one alias on purpose: each owns its own host PTY.
   * @param alias - the configured host alias.
   * @returns the new tab id.
   */
  openTerminalTab(alias) {
    this.nextTerminalTabSeq += 1;
    const id = "tab-" + String(this.nextTerminalTabSeq);
    this.terminalTabs = [...this.terminalTabs, { id, alias, status: "connecting" }];
    this.activeTerminalTabId = id;
    this.draftAlias = alias;
    this.retainedScreens.delete(id);
    this.commit();
    return id;
  }
  /**
   * Show an existing tab and make the toolbar follow its host, so a new tab
   * opens on the host the user is looking at.
   * @param id - the tab id.
   */
  setActiveTerminalTab(id) {
    if (this.activeTerminalTabId === id) return;
    const tab = this.terminalTab(id);
    if (tab === void 0) return;
    this.activeTerminalTabId = id;
    this.draftAlias = tab.alias;
    this.commit();
  }
  /**
   * Remove one tab and forget its screen. When the shown tab closes, the
   * neighbours decide what the xterm shows next: the tab that took its place,
   * else the one before it, else nothing.
   * @param id - the tab id.
   */
  closeTerminalTab(id) {
    const index = this.terminalTabs.findIndex((tab) => tab.id === id);
    this.retainedScreens.delete(id);
    const adopted = this.adoptedLinks.get(id);
    if (adopted !== void 0) adopted.intent = "close";
    if (index < 0) return;
    const wasActive = this.activeTerminalTabId === id;
    this.terminalTabs = this.terminalTabs.filter((tab) => tab.id !== id);
    if (wasActive) {
      const neighbour = this.terminalTabs[index] ?? this.terminalTabs[index - 1];
      this.activeTerminalTabId = neighbour?.id;
      if (neighbour !== void 0) this.draftAlias = neighbour.alias;
    }
    this.commit();
  }
  /** The tab record with this id, or undefined when it no longer exists. */
  terminalTab(id) {
    return this.terminalTabs.find((tab) => tab.id === id);
  }
  /**
   * Apply a partial update to one tab; a tab that was closed in the meantime
   * is left alone rather than resurrected.
   * @param id - the tab id.
   * @param patch - the fields to change.
   */
  patchTerminalTab(id, patch) {
    let found = false;
    const next = this.terminalTabs.map((tab) => {
      if (tab.id !== id) return tab;
      found = true;
      return { ...tab, ...patch };
    });
    if (!found) return;
    this.terminalTabs = next;
    this.commit();
  }
  /**
   * Record the host session of a ready tab and clear the challenge it carried.
   * @param id - the tab id.
   * @param sessionId - the id the host reported on its ready frame.
   */
  readyTerminalTab(id, sessionId) {
    this.patchTerminalTab(id, {
      status: "connected",
      sessionId,
      detail: void 0,
      closeError: void 0,
      authPrompt: void 0,
      authAnswers: void 0
    });
  }
  /**
   * The remote shell ended: the tab keeps its screen and its place, and the
   * dead session id is dropped so nothing tries to reattach to it.
   * @param id - the tab id.
   * @param detail - why it ended, when the transport said.
   */
  exitTerminalTab(id, detail) {
    this.patchTerminalTab(id, {
      status: "exited",
      sessionId: void 0,
      detail,
      authPrompt: void 0,
      authAnswers: void 0,
      closeError: void 0
    });
  }
  /**
   * The connection failed. The tab stays with the reason so the user can read
   * it and close the tab themselves.
   * @param id - the tab id.
   * @param detail - the failure text.
   */
  failTerminalTab(id, detail) {
    this.patchTerminalTab(id, {
      status: "error",
      sessionId: void 0,
      detail,
      authPrompt: void 0,
      authAnswers: void 0,
      closeError: void 0
    });
  }
  /**
   * A background close never reached the host. The tab keeps its live session
   * id (so a retry can still end it) and says so instead of vanishing.
   * @param id - the tab id.
   * @param reason - the reason code shown by the view.
   */
  markTerminalCloseFailed(id, reason) {
    this.patchTerminalTab(id, { closeError: reason });
  }
  /**
   * Store the keyboard-interactive challenge this tab has to answer, with a
   * blank answer of this challenge's own length. A prompt on another tab never
   * touches this record, which is what keeps two challenges from sharing input.
   * @param id - the tab id.
   * @param prompt - the challenge the host asked for.
   */
  setTerminalAuthPrompt(id, prompt) {
    this.patchTerminalTab(id, { authPrompt: prompt, authAnswers: prompt.prompts.map(() => "") });
  }
  /**
   * Record one character typed for this tab's challenge.
   * @param id - the tab id.
   * @param index - which prompt of the challenge.
   * @param value - the field's current text.
   */
  setTerminalAuthAnswer(id, index, value) {
    const tab = this.terminalTab(id);
    if (tab === void 0 || tab.authPrompt === void 0) return;
    const answers = [...tab.authAnswers ?? tab.authPrompt.prompts.map(() => "")];
    answers[index] = value;
    this.patchTerminalTab(id, { authAnswers: answers });
  }
  /** Drop the challenge once it was answered, cancelled, or could not apply. */
  clearTerminalAuthPrompt(id) {
    if (this.terminalTab(id)?.authPrompt === void 0) return;
    this.patchTerminalTab(id, { authPrompt: void 0, authAnswers: void 0 });
  }
  /** Choose the alias the next terminal tab opens on. */
  setDraftAlias(alias) {
    if (this.draftAlias === alias) return;
    this.draftAlias = alias;
    this.commit();
  }
  /** Append one output chunk to the retained screen of a tab. */
  appendTerminalOutput(id, chunk) {
    const screen = this.retainedScreens.get(id) ?? { chunks: [], bytes: 0 };
    screen.chunks.push(chunk);
    screen.bytes += utf8Bytes(chunk);
    while (screen.bytes > MAX_RETAINED_BYTES && screen.chunks.length > 1) {
      const dropped = screen.chunks.shift() ?? "";
      screen.bytes -= utf8Bytes(dropped);
    }
    this.retainedScreens.set(id, screen);
  }
  /** The retained screen of a tab, concatenated for a redraw. */
  readTerminalOutput(id) {
    return (this.retainedScreens.get(id)?.chunks ?? []).join("");
  }
  /** Forget the retained screen (a fresh replay from the host replaces it). */
  clearTerminalOutput(id) {
    this.retainedScreens.delete(id);
  }
  /**
   * Keep a still-connecting socket alive after its view went away. The socket
   * cannot be detached yet (no session id), so the intent is applied when the
   * host reports it: `detach` leaves the shell for a later reattach, `close`
   * ends the session of a tab the user closed.
   * @param tabId - the tab the socket belongs to.
   * @param connection - the live connection.
   * @param intent - what to do once the session id arrives.
   */
  adoptTerminalLink(tabId, connection, intent) {
    const entry = { connection, intent };
    this.adoptedLinks.set(tabId, entry);
    connection.onOutput = (data) => {
      if (this.terminalTab(tabId) === void 0) return;
      this.appendTerminalOutput(tabId, data);
    };
    connection.onAuthPrompt = (name, instructions, prompts) => {
      if (this.terminalTab(tabId) === void 0) return;
      this.setTerminalAuthPrompt(tabId, { name, instructions, prompts });
    };
    connection.onReady = (sessionId) => {
      const decided = this.adoptedLinks.get(tabId)?.intent ?? entry.intent;
      this.adoptedLinks.delete(tabId);
      this.readyTerminalTab(tabId, sessionId);
      if (decided === "close") connection.close();
      else connection.detach();
    };
    connection.onExit = (_code, error) => {
      this.adoptedLinks.delete(tabId);
      this.failTerminalTab(tabId, error ?? "connection closed");
    };
  }
  /**
   * Take an adopted socket back when its tab is shown again, so the host never
   * opens a second PTY for the same tab.
   * @param tabId - the tab id.
   * @returns the connection, or undefined when nothing was adopted.
   */
  reclaimTerminalLink(tabId) {
    const adopted = this.adoptedLinks.get(tabId);
    if (adopted === void 0) return void 0;
    if (adopted.intent === "close") return void 0;
    this.adoptedLinks.delete(tabId);
    adopted.connection.onReady = void 0;
    adopted.connection.onExit = void 0;
    adopted.connection.onAuthPrompt = void 0;
    return adopted.connection;
  }
  commit() {
    this.snapshot = {
      panelOpen: this.panelOpen,
      activeTab: this.activeTab,
      terminalTabs: this.terminalTabs,
      activeTerminalTabId: this.activeTerminalTabId,
      draftAlias: this.draftAlias
    };
    for (const fn2 of [...this.listeners]) fn2();
  }
  /** Ask the layout to select a panel; a shell without the face is a no-op. */
  selectPanel(panelId) {
    try {
      this.deps.panel?.select(panelId);
    } catch {
    }
  }
};

// src/client/panel/SshPanel.tsx
var import_react8 = require("react");

// src/client/panel/ClusterTab.tsx
var import_react = require("react");

// src/client/panel/panel.module.css
var panel_default = {
  view: "panel_view",
  panel: "panel_panel",
  panelHeader: "panel_panelHeader",
  panelTitle: "panel_panelTitle",
  backButton: "panel_backButton",
  tabBar: "panel_tabBar",
  tab: "panel_tab",
  panelContent: "panel_panelContent",
  tabBody: "panel_tabBody",
  fillBody: "panel_fillBody",
  toolbar: "panel_toolbar",
  controls: "panel_controls",
  input: "panel_input",
  toolbarSpacer: "panel_toolbarSpacer",
  search: "panel_search",
  groupBySelect: "panel_groupBySelect",
  groupSection: "panel_groupSection",
  groupHeader: "panel_groupHeader",
  groupToggle: "panel_groupToggle",
  groupChevron: "panel_groupChevron",
  groupName: "panel_groupName",
  groupCount: "panel_groupCount",
  tableWrap: "panel_tableWrap",
  table: "panel_table",
  mono: "panel_mono",
  cellMuted: "panel_cellMuted",
  actions: "panel_actions",
  inlineTest: "panel_inlineTest",
  badge: "panel_badge",
  primaryButton: "panel_primaryButton",
  ghostButton: "panel_ghostButton",
  iconButton: "panel_iconButton",
  linkButton: "panel_linkButton",
  spinner: "panel_spinner",
  dshSshSpin: "panel_dshSshSpin",
  banner: "panel_banner",
  importSkips: "panel_importSkips",
  importSkipRow: "panel_importSkipRow",
  empty: "panel_empty",
  loading: "panel_loading",
  modalBackdrop: "panel_modalBackdrop",
  modal: "panel_modal",
  modalTitle: "panel_modalTitle",
  modalFooter: "panel_modalFooter",
  formError: "panel_formError",
  hint: "panel_hint",
  field: "panel_field",
  fieldLabel: "panel_fieldLabel",
  formRow: "panel_formRow",
  radioRow: "panel_radioRow",
  radioLabel: "panel_radioLabel",
  termBody: "panel_termBody",
  termTabs: "panel_termTabs",
  termTab: "panel_termTab",
  termTabLabel: "panel_termTabLabel",
  termTabAlias: "panel_termTabAlias",
  termTabState: "panel_termTabState",
  termTabClose: "panel_termTabClose",
  termTabNew: "panel_termTabNew",
  termWrap: "panel_termWrap",
  termContainer: "panel_termContainer",
  termPlaceholder: "panel_termPlaceholder",
  hiddenFile: "panel_hiddenFile",
  browsePanel: "panel_browsePanel",
  browseHeader: "panel_browseHeader",
  browsePath: "panel_browsePath",
  browseList: "panel_browseList",
  dirRow: "panel_dirRow",
  dirName: "panel_dirName",
  dirType: "panel_dirType",
  dirSize: "panel_dirSize",
  transferBlock: "panel_transferBlock",
  progressMeta: "panel_progressMeta",
  progressTrack: "panel_progressTrack",
  progressBar: "panel_progressBar",
  previewPanel: "panel_previewPanel",
  previewHeader: "panel_previewHeader",
  previewTitle: "panel_previewTitle",
  previewText: "panel_previewText",
  previewImage: "panel_previewImage",
  previewTableWrap: "panel_previewTableWrap",
  previewTable: "panel_previewTable",
  tunnelList: "panel_tunnelList",
  tunnelRow: "panel_tunnelRow",
  tunnelLabel: "panel_tunnelLabel",
  formCard: "panel_formCard",
  clusterForm: "panel_clusterForm",
  clusterFilters: "panel_clusterFilters",
  commandInput: "panel_commandInput",
  cellDetails: "panel_cellDetails",
  cellPre: "panel_cellPre"
};

// src/client/panel/ClusterTab.tsx
function splitList(text) {
  return text.split(",").map((part) => part.trim()).filter((part) => part !== "");
}
function ClusterTab({ api }) {
  const [command, setCommand] = (0, import_react.useState)("");
  const [aliases, setAliases] = (0, import_react.useState)("");
  const [environment, setEnvironment] = (0, import_react.useState)("");
  const [tags, setTags] = (0, import_react.useState)("");
  const [running, setRunning] = (0, import_react.useState)(false);
  const [results, setResults] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const run = async () => {
    if (command.trim() === "" || running) return;
    if (!window.confirm(tt("cluster.confirm"))) return;
    setRunning(true);
    setError(null);
    try {
      const aliasList = splitList(aliases);
      const tagList = splitList(tags);
      const outcome = await api.cluster({
        command: command.trim(),
        aliases: aliasList.length > 0 ? aliasList : void 0,
        environment: environment.trim() === "" ? void 0 : environment.trim(),
        tags: tagList.length > 0 ? tagList : void 0
      });
      setResults(outcome);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setRunning(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.fillBody }, /* @__PURE__ */ React.createElement("div", { className: panel_default.clusterForm }, /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("cluster.command")), /* @__PURE__ */ React.createElement("textarea", { className: panel_default.input + " " + panel_default.commandInput, value: command, onChange: (event) => {
    setCommand(event.target.value);
  } })), /* @__PURE__ */ React.createElement("div", { className: panel_default.clusterFilters }, /* @__PURE__ */ React.createElement("input", { className: panel_default.input, placeholder: tt("cluster.aliases"), value: aliases, onChange: (event) => {
    setAliases(event.target.value);
  } }), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, placeholder: tt("cluster.environment"), value: environment, onChange: (event) => {
    setEnvironment(event.target.value);
  } }), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, placeholder: tt("cluster.tags"), value: tags, onChange: (event) => {
    setTags(event.target.value);
  } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.primaryButton, disabled: running || command.trim() === "", onClick: () => {
    void run();
  } }, tt("cluster.run")))), error !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error" }, tt("common.error", { error })), results === null && error === null && /* @__PURE__ */ React.createElement("div", { className: panel_default.empty }, tt("cluster.empty")), results !== null && results.length === 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.empty }, tt("cluster.noMatch")), results !== null && results.length > 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.tableWrap }, /* @__PURE__ */ React.createElement("table", { className: panel_default.table }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, tt("cluster.col.alias")), /* @__PURE__ */ React.createElement("th", null, tt("cluster.col.status")), /* @__PURE__ */ React.createElement("th", null, tt("cluster.col.exit")), /* @__PURE__ */ React.createElement("th", null, tt("cluster.col.stdout")), /* @__PURE__ */ React.createElement("th", null, tt("cluster.col.stderr")), /* @__PURE__ */ React.createElement("th", null, tt("cluster.col.error")), /* @__PURE__ */ React.createElement("th", null, tt("cluster.col.duration")))), /* @__PURE__ */ React.createElement("tbody", null, results.map((result) => {
    const status = result.ok ? "ok" : result.timedOut === true ? "timeout" : "fail";
    const label = result.ok ? tt("cluster.ok") : result.timedOut === true ? tt("cluster.timeout") : tt("cluster.fail");
    return /* @__PURE__ */ React.createElement("tr", { key: result.alias }, /* @__PURE__ */ React.createElement("td", { className: panel_default.mono }, result.alias), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: panel_default.badge, "data-status": status }, label)), /* @__PURE__ */ React.createElement("td", { className: panel_default.mono }, result.exitCode ?? "-"), /* @__PURE__ */ React.createElement("td", null, result.stdout !== void 0 && result.stdout !== "" && /* @__PURE__ */ React.createElement("details", { className: panel_default.cellDetails }, /* @__PURE__ */ React.createElement("summary", null, tt("cluster.col.stdout")), /* @__PURE__ */ React.createElement("pre", { className: panel_default.cellPre }, result.stdout))), /* @__PURE__ */ React.createElement("td", null, result.stderr !== void 0 && result.stderr !== "" && /* @__PURE__ */ React.createElement("details", { className: panel_default.cellDetails }, /* @__PURE__ */ React.createElement("summary", null, tt("cluster.col.stderr")), /* @__PURE__ */ React.createElement("pre", { className: panel_default.cellPre }, result.stderr))), /* @__PURE__ */ React.createElement("td", { className: panel_default.cellMuted }, result.error ?? ""), /* @__PURE__ */ React.createElement("td", { className: panel_default.mono }, result.durationMs !== void 0 ? result.durationMs + " ms" : "-"));
  })))));
}

// src/client/panel/HostsTab.tsx
var import_react3 = require("react");

// src/client/panel/HostFormDialog.tsx
var import_react2 = require("react");
function splitList2(text) {
  return text.split(",").map((part) => part.trim()).filter((part) => part !== "");
}
function blankOf(editing) {
  return {
    alias: editing?.alias ?? "",
    host: editing?.host ?? "",
    port: String(editing?.port ?? 22),
    user: editing?.user ?? "",
    authKind: editing?.auth ?? "key",
    keyPath: "",
    passphrase: "",
    password: "",
    agentPath: "",
    proxyJump: (editing?.proxyJump ?? []).join(", "),
    proxyCommand: editing?.proxyCommand ?? "",
    forwardAgent: editing?.forwardAgent === true,
    description: editing?.description ?? "",
    environment: editing?.environment ?? "",
    tags: (editing?.tags ?? []).join(", "),
    location: editing?.location ?? ""
  };
}
function HostFormDialog({ api, editing, onClose, onSaved }) {
  const [form, setForm] = (0, import_react2.useState)(() => blankOf(editing));
  const [saving, setSaving] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const save = async () => {
    const alias = form.alias.trim();
    const host = form.host.trim();
    const user = form.user.trim();
    if (alias === "" || host === "" || user === "") {
      setError(tt("form.required"));
      return;
    }
    const port = Number(form.port);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      setError(tt("form.portInvalid"));
      return;
    }
    if (editing == null && form.authKind === "password" && form.password === "") {
      setError(tt("form.passwordRequired"));
      return;
    }
    const secretEmpty = form.authKind === "password" ? form.password === "" : form.authKind === "key" ? form.keyPath.trim() === "" : false;
    const auth = editing != null && secretEmpty ? void 0 : form.authKind === "password" ? { kind: "password", password: form.password } : form.authKind === "key" ? { kind: "key", keyPath: form.keyPath.trim(), passphrase: form.passphrase === "" ? void 0 : form.passphrase } : { kind: "agent", agentPath: form.agentPath.trim() === "" ? void 0 : form.agentPath.trim() };
    const payload = {
      host,
      port,
      user,
      auth,
      proxyJump: splitList2(form.proxyJump),
      // Always sent (never omitted): an empty value is the explicit clear,
      // because the API cannot express "remove this field" any other way.
      proxyCommand: form.proxyCommand.trim(),
      // Always sent (never omitted): the flag is a plain boolean, so saving the
      // form can both enable and clear forwarding (omitting it would keep the
      // stored value under PATCH semantics).
      forwardAgent: form.forwardAgent,
      description: form.description.trim() === "" ? void 0 : form.description.trim(),
      environment: form.environment.trim() === "" ? void 0 : form.environment.trim(),
      tags: splitList2(form.tags),
      location: form.location.trim() === "" ? void 0 : form.location.trim()
    };
    setSaving(true);
    setError(null);
    try {
      const saved = editing != null ? await api.updateHost(editing.alias, payload) : await api.createHost({ ...payload, alias });
      onSaved(saved);
    } catch (cause) {
      setError(errorMessage(cause));
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.modalBackdrop, onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: panel_default.modal, role: "dialog", "aria-modal": "true", onClick: (event) => {
    event.stopPropagation();
  } }, /* @__PURE__ */ React.createElement("h3", { className: panel_default.modalTitle }, editing != null ? tt("form.title.edit", { alias: editing.alias }) : tt("form.title.create")), /* @__PURE__ */ React.createElement("div", { className: panel_default.formRow }, /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.alias")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.alias, disabled: editing != null, onChange: (event) => {
    set("alias", event.target.value);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.aliasHint"))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.host")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.host, onChange: (event) => {
    set("host", event.target.value);
  } }))), /* @__PURE__ */ React.createElement("div", { className: panel_default.formRow }, /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.port")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, type: "number", min: 1, max: 65535, value: form.port, onChange: (event) => {
    set("port", event.target.value);
  } })), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.user")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.user, onChange: (event) => {
    set("user", event.target.value);
  } }))), /* @__PURE__ */ React.createElement("div", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.auth")), /* @__PURE__ */ React.createElement("div", { className: panel_default.radioRow }, /* @__PURE__ */ React.createElement("label", { className: panel_default.radioLabel }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "dsh-ssh-auth", checked: form.authKind === "key", onChange: () => {
    set("authKind", "key");
  } }), tt("form.auth.key")), /* @__PURE__ */ React.createElement("label", { className: panel_default.radioLabel }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "dsh-ssh-auth", checked: form.authKind === "password", onChange: () => {
    set("authKind", "password");
  } }), tt("form.auth.password")), /* @__PURE__ */ React.createElement("label", { className: panel_default.radioLabel }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "dsh-ssh-auth", checked: form.authKind === "agent", onChange: () => {
    set("authKind", "agent");
  } }), tt("form.auth.agent"))), editing != null && /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.authKeepHint"))), form.authKind === "key" ? /* @__PURE__ */ React.createElement("div", { className: panel_default.formRow }, /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.keyPath")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.keyPath, onChange: (event) => {
    set("keyPath", event.target.value);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.keyPathHint"))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.passphrase")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, type: "password", value: form.passphrase, onChange: (event) => {
    set("passphrase", event.target.value);
  } }))) : form.authKind === "agent" ? /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.agentPath")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.agentPath, onChange: (event) => {
    set("agentPath", event.target.value);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.agentPathHint"))) : /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.password")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, type: "password", value: form.password, onChange: (event) => {
    set("password", event.target.value);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.passwordHint"))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.proxyJump")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.proxyJump, onChange: (event) => {
    set("proxyJump", event.target.value);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.proxyJumpHint"))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.proxyCommand")), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: panel_default.input,
      value: form.proxyCommand,
      placeholder: "corp-vpn proxy %h %p %r",
      onChange: (event) => {
        set("proxyCommand", event.target.value);
      }
    }
  ), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.proxyCommandHint"))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.forwardAgent")), /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: form.forwardAgent, onChange: (event) => {
    set("forwardAgent", event.target.checked);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.forwardAgentHint"))), /* @__PURE__ */ React.createElement("div", { className: panel_default.formRow }, /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.environment")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.environment, onChange: (event) => {
    set("environment", event.target.value);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.environmentHint"))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.location")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.location, onChange: (event) => {
    set("location", event.target.value);
  } }))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.description")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.description, onChange: (event) => {
    set("description", event.target.value);
  } })), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("form.tags")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: form.tags, onChange: (event) => {
    set("tags", event.target.value);
  } }), /* @__PURE__ */ React.createElement("span", { className: panel_default.hint }, tt("form.tagsHint"))), error !== null && /* @__PURE__ */ React.createElement("p", { className: panel_default.formError }, tt("common.error", { error })), /* @__PURE__ */ React.createElement("div", { className: panel_default.modalFooter }, /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, disabled: saving, onClick: onClose }, tt("form.cancel")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.primaryButton, disabled: saving, onClick: () => {
    void save();
  } }, tt("form.save")))));
}

// src/client/panel/HostsTab.tsx
var IMPORT_SKIP_LIMIT = 8;
var IMPORT_REASON_KEY = {
  wildcard: "import.reason.wildcard",
  existing: "import.reason.existing",
  match: "import.reason.match",
  invalid: "import.reason.invalid"
};
function groupHosts(hosts, groupBy) {
  if (groupBy === "none") return [{ key: "", hosts }];
  const buckets = /* @__PURE__ */ new Map();
  const push = (key, host) => {
    const bucket = buckets.get(key);
    if (bucket === void 0) buckets.set(key, [host]);
    else bucket.push(host);
  };
  for (const host of hosts) {
    if (groupBy === "environment") {
      push(host.environment ?? "", host);
    } else if (host.tags.length === 0) {
      push("", host);
    } else {
      for (const tag of host.tags) push(tag, host);
    }
  }
  return [...buckets.entries()].sort(([a], [b2]) => a === "" ? 1 : b2 === "" ? -1 : a.localeCompare(b2)).map(([key, group]) => ({ key, hosts: group }));
}
function HostsTab({ api, onConnect }) {
  const [hosts, setHosts] = (0, import_react3.useState)(null);
  const [error, setError] = (0, import_react3.useState)(null);
  const [search, setSearch] = (0, import_react3.useState)("");
  const [testingAlias, setTestingAlias] = (0, import_react3.useState)(null);
  const [testResults, setTestResults] = (0, import_react3.useState)({});
  const [importing, setImporting] = (0, import_react3.useState)(false);
  const [notice, setNotice] = (0, import_react3.useState)(null);
  const [importSkips, setImportSkips] = (0, import_react3.useState)([]);
  const [dialog, setDialog] = (0, import_react3.useState)(null);
  const [groupBy, setGroupBy] = (0, import_react3.useState)("none");
  const [collapsed, setCollapsed] = (0, import_react3.useState)({});
  const [testingGroup, setTestingGroup] = (0, import_react3.useState)(null);
  const seqRef = (0, import_react3.useRef)(0);
  const mountedRef = (0, import_react3.useRef)(true);
  (0, import_react3.useEffect)(() => () => {
    mountedRef.current = false;
  }, []);
  const load = (0, import_react3.useCallback)(async (query2) => {
    const seq = ++seqRef.current;
    try {
      const list = await api.listHosts(query2);
      if (!mountedRef.current || seq !== seqRef.current) return;
      setHosts(list);
      setError(null);
    } catch (cause) {
      if (!mountedRef.current || seq !== seqRef.current) return;
      setError(errorMessage(cause));
    }
  }, [api]);
  (0, import_react3.useEffect)(() => {
    void load();
  }, [load]);
  (0, import_react3.useEffect)(() => {
    const timer = setTimeout(() => {
      const query2 = search.trim();
      void load(query2 === "" ? void 0 : query2);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [search, load]);
  const runTest = async (alias) => {
    if (!mountedRef.current) return;
    setTestingAlias(alias);
    try {
      const result = await api.testHost(alias);
      if (!mountedRef.current) return;
      setTestResults((prev) => ({ ...prev, [alias]: result }));
    } catch (cause) {
      if (!mountedRef.current) return;
      setTestResults((prev) => ({ ...prev, [alias]: { ok: false, error: errorMessage(cause) } }));
    } finally {
      if (mountedRef.current) setTestingAlias(null);
    }
  };
  const deleteHost = async (alias) => {
    if (!window.confirm(tt("hosts.deleteConfirm", { alias }))) return;
    try {
      await api.deleteHost(alias);
      if (!mountedRef.current) return;
      void load();
    } catch (cause) {
      if (!mountedRef.current) return;
      setError(errorMessage(cause));
    }
  };
  const testGroup = async (group) => {
    if (!mountedRef.current) return;
    setTestingGroup(group.key);
    try {
      await Promise.all(group.hosts.map((host) => runTest(host.alias)));
    } finally {
      if (mountedRef.current) setTestingGroup(null);
    }
  };
  const importConfig = async () => {
    if (!mountedRef.current) return;
    setImporting(true);
    try {
      const result = await api.importSshConfig();
      if (!mountedRef.current) return;
      setNotice(tt("hosts.imported", { parsed: result.parsed, added: result.added, skipped: result.skipped }));
      setImportSkips(result.skippedBlocks);
      void load();
    } catch (cause) {
      if (!mountedRef.current) return;
      setError(errorMessage(cause));
    } finally {
      if (mountedRef.current) setImporting(false);
    }
  };
  const renderHostRow = (host) => {
    const test = testResults[host.alias];
    return /* @__PURE__ */ React.createElement("tr", { key: host.alias }, /* @__PURE__ */ React.createElement("td", { className: panel_default.mono }, host.alias), /* @__PURE__ */ React.createElement("td", { className: panel_default.mono }, host.host, ":", host.port, host.proxyCommand !== void 0 && /* @__PURE__ */ React.createElement("span", { className: panel_default.badge, "data-kind": "proxy", title: host.proxyCommand }, tt("hosts.proxyBadge")), host.forwardAgent === true && /* @__PURE__ */ React.createElement("span", { className: panel_default.badge, "data-kind": "forward-agent", title: tt("hosts.forwardAgentHint") }, tt("hosts.forwardAgentBadge"))), /* @__PURE__ */ React.createElement("td", null, host.user), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: panel_default.badge, "data-kind": host.auth }, host.auth === "key" ? tt("form.auth.key") : host.auth === "password" ? tt("form.auth.password") : tt("form.auth.agent"))), /* @__PURE__ */ React.createElement("td", { className: panel_default.cellMuted }, host.environment ?? ""), /* @__PURE__ */ React.createElement("td", { className: panel_default.cellMuted }, host.tags.join(", ")), /* @__PURE__ */ React.createElement("td", { className: panel_default.cellMuted }, host.description ?? ""), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: panel_default.actions }, /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.linkButton, disabled: testingAlias === host.alias, onClick: () => {
      void runTest(host.alias);
    } }, testingAlias === host.alias ? tt("hosts.testing") : tt("hosts.test")), testingAlias === host.alias && /* @__PURE__ */ React.createElement("span", { className: panel_default.spinner, "aria-hidden": "true" }), test !== void 0 && /* @__PURE__ */ React.createElement("span", { className: panel_default.inlineTest, "data-status": test.ok ? "ok" : "fail" }, test.ok ? tt("hosts.testOk", { latency: test.latencyMs ?? 0 }) : tt("hosts.testFail", { error: test.error ?? "" })), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.linkButton, onClick: () => {
      setDialog({ mode: "edit", host });
    } }, tt("hosts.edit")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.linkButton, "data-danger": true, onClick: () => {
      void deleteHost(host.alias);
    } }, tt("hosts.delete")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, onClick: () => {
      onConnect(host.alias);
    } }, tt("hosts.connected")))));
  };
  const renderHostTable = (rows) => /* @__PURE__ */ React.createElement("table", { className: panel_default.table }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.alias")), /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.host")), /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.user")), /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.auth")), /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.environment")), /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.tags")), /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.description")), /* @__PURE__ */ React.createElement("th", null, tt("hosts.col.actions")))), /* @__PURE__ */ React.createElement("tbody", null, rows.map(renderHostRow)));
  const groups = hosts === null ? [] : groupHosts(hosts, groupBy);
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.fillBody }, /* @__PURE__ */ React.createElement("div", { className: panel_default.toolbar }, /* @__PURE__ */ React.createElement("input", { className: panel_default.search, type: "search", placeholder: tt("hosts.search"), value: search, onChange: (event) => {
    setSearch(event.target.value);
  } }), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: panel_default.groupBySelect,
      "aria-label": tt("hosts.groupBy.label"),
      value: groupBy,
      onChange: (event) => {
        setGroupBy(event.target.value);
      }
    },
    /* @__PURE__ */ React.createElement("option", { value: "none" }, tt("hosts.groupBy.none")),
    /* @__PURE__ */ React.createElement("option", { value: "environment" }, tt("hosts.groupBy.environment")),
    /* @__PURE__ */ React.createElement("option", { value: "tags" }, tt("hosts.groupBy.tags"))
  ), /* @__PURE__ */ React.createElement("div", { className: panel_default.toolbarSpacer }), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.primaryButton, onClick: () => {
    setDialog({ mode: "create" });
  } }, tt("hosts.add")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, disabled: importing, onClick: () => {
    void importConfig();
  } }, importing ? tt("common.loading") : tt("hosts.import"))), notice !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "ok" }, notice), notice !== null && importSkips.length > 0 && /* @__PURE__ */ React.createElement("ul", { className: panel_default.importSkips }, importSkips.slice(0, IMPORT_SKIP_LIMIT).map((block) => /* @__PURE__ */ React.createElement("li", { key: block.name, className: panel_default.importSkipRow }, /* @__PURE__ */ React.createElement("span", { className: panel_default.mono }, block.name), /* @__PURE__ */ React.createElement("span", { className: panel_default.cellMuted }, tt(IMPORT_REASON_KEY[block.reason])))), importSkips.length > IMPORT_SKIP_LIMIT && /* @__PURE__ */ React.createElement("li", { className: panel_default.importSkipRow }, /* @__PURE__ */ React.createElement("span", { className: panel_default.cellMuted }, tt("import.more", { count: importSkips.length - IMPORT_SKIP_LIMIT })))), error !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error" }, tt("common.error", { error })), hosts === null && error === null && /* @__PURE__ */ React.createElement("div", { className: panel_default.loading }, tt("common.loading")), hosts !== null && hosts.length === 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.empty }, tt("hosts.empty")), hosts !== null && hosts.length > 0 && groupBy === "none" && /* @__PURE__ */ React.createElement("div", { className: panel_default.tableWrap }, renderHostTable(hosts)), hosts !== null && hosts.length > 0 && groupBy !== "none" && /* @__PURE__ */ React.createElement("div", { className: panel_default.tableWrap }, groups.map((group) => {
    const isCollapsed = collapsed[group.key] === true;
    const label = group.key === "" ? groupBy === "tags" ? tt("hosts.group.noTags") : tt("hosts.group.ungrouped") : group.key;
    return /* @__PURE__ */ React.createElement("section", { key: group.key, className: panel_default.groupSection }, /* @__PURE__ */ React.createElement("div", { className: panel_default.groupHeader }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: panel_default.groupToggle,
        "aria-expanded": !isCollapsed,
        onClick: () => {
          setCollapsed((prev) => ({ ...prev, [group.key]: !isCollapsed }));
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: panel_default.groupChevron, "data-collapsed": isCollapsed || void 0, "aria-hidden": "true" }),
      /* @__PURE__ */ React.createElement("span", { className: panel_default.groupName }, label),
      /* @__PURE__ */ React.createElement("span", { className: panel_default.groupCount }, tt("hosts.group.count", { count: group.hosts.length }))
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: panel_default.linkButton,
        disabled: testingGroup === group.key,
        onClick: () => {
          void testGroup(group);
        }
      },
      testingGroup === group.key ? tt("hosts.testing") : tt("hosts.group.testAll")
    )), !isCollapsed && renderHostTable(group.hosts));
  })), dialog !== null && /* @__PURE__ */ React.createElement(
    HostFormDialog,
    {
      api,
      editing: dialog.mode === "edit" ? dialog.host : null,
      onClose: () => {
        setDialog(null);
      },
      onSaved: () => {
        setDialog(null);
        void load();
      }
    }
  ));
}

// src/client/panel/TerminalTab.tsx
var import_react4 = require("react");

// ../../../dsh-ssh-research/node_modules/@xterm/xterm/lib/xterm.mjs
var zs = Object.defineProperty;
var Rl = Object.getOwnPropertyDescriptor;
var Ll = (s15, t2) => {
  for (var e in t2) zs(s15, e, { get: t2[e], enumerable: true });
};
var M = (s15, t2, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Rl(t2, e) : t2, n = s15.length - 1, o2; n >= 0; n--) (o2 = s15[n]) && (r = (i ? o2(t2, e, r) : o2(r)) || r);
  return i && r && zs(t2, e, r), r;
};
var S = (s15, t2) => (e, i) => t2(e, i, s15);
var Gs = "Terminal input";
var mi = { get: () => Gs, set: (s15) => Gs = s15 };
var $s = "Too much output to announce, navigate to rows manually to read";
var _i = { get: () => $s, set: (s15) => $s = s15 };
function Al(s15) {
  return s15.replace(/\r?\n/g, "\r");
}
function kl(s15, t2) {
  return t2 ? "\x1B[200~" + s15 + "\x1B[201~" : s15;
}
function Vs(s15, t2) {
  s15.clipboardData && s15.clipboardData.setData("text/plain", t2.selectionText), s15.preventDefault();
}
function qs(s15, t2, e, i) {
  if (s15.stopPropagation(), s15.clipboardData) {
    let r = s15.clipboardData.getData("text/plain");
    Cn(r, t2, e, i);
  }
}
function Cn(s15, t2, e, i) {
  s15 = Al(s15), s15 = kl(s15, e.decPrivateModes.bracketedPasteMode && i.rawOptions.ignoreBracketedPasteMode !== true), e.triggerDataEvent(s15, true), t2.value = "";
}
function Mn(s15, t2, e) {
  let i = e.getBoundingClientRect(), r = s15.clientX - i.left - 10, n = s15.clientY - i.top - 10;
  t2.style.width = "20px", t2.style.height = "20px", t2.style.left = `${r}px`, t2.style.top = `${n}px`, t2.style.zIndex = "1000", t2.focus();
}
function Pn(s15, t2, e, i, r) {
  Mn(s15, t2, e), r && i.rightClickSelect(s15), t2.value = i.selectionText, t2.select();
}
function Ce(s15) {
  return s15 > 65535 ? (s15 -= 65536, String.fromCharCode((s15 >> 10) + 55296) + String.fromCharCode(s15 % 1024 + 56320)) : String.fromCharCode(s15);
}
function It(s15, t2 = 0, e = s15.length) {
  let i = "";
  for (let r = t2; r < e; ++r) {
    let n = s15[r];
    n > 65535 ? (n -= 65536, i += String.fromCharCode((n >> 10) + 55296) + String.fromCharCode(n % 1024 + 56320)) : i += String.fromCharCode(n);
  }
  return i;
}
var er = class {
  constructor() {
    this._interim = 0;
  }
  clear() {
    this._interim = 0;
  }
  decode(t2, e) {
    let i = t2.length;
    if (!i) return 0;
    let r = 0, n = 0;
    if (this._interim) {
      let o2 = t2.charCodeAt(n++);
      56320 <= o2 && o2 <= 57343 ? e[r++] = (this._interim - 55296) * 1024 + o2 - 56320 + 65536 : (e[r++] = this._interim, e[r++] = o2), this._interim = 0;
    }
    for (let o2 = n; o2 < i; ++o2) {
      let l = t2.charCodeAt(o2);
      if (55296 <= l && l <= 56319) {
        if (++o2 >= i) return this._interim = l, r;
        let a = t2.charCodeAt(o2);
        56320 <= a && a <= 57343 ? e[r++] = (l - 55296) * 1024 + a - 56320 + 65536 : (e[r++] = l, e[r++] = a);
        continue;
      }
      l !== 65279 && (e[r++] = l);
    }
    return r;
  }
};
var tr = class {
  constructor() {
    this.interim = new Uint8Array(3);
  }
  clear() {
    this.interim.fill(0);
  }
  decode(t2, e) {
    let i = t2.length;
    if (!i) return 0;
    let r = 0, n, o2, l, a, u = 0, h2 = 0;
    if (this.interim[0]) {
      let _2 = false, p = this.interim[0];
      p &= (p & 224) === 192 ? 31 : (p & 240) === 224 ? 15 : 7;
      let m = 0, f;
      for (; (f = this.interim[++m] & 63) && m < 4; ) p <<= 6, p |= f;
      let A = (this.interim[0] & 224) === 192 ? 2 : (this.interim[0] & 240) === 224 ? 3 : 4, R = A - m;
      for (; h2 < R; ) {
        if (h2 >= i) return 0;
        if (f = t2[h2++], (f & 192) !== 128) {
          h2--, _2 = true;
          break;
        } else this.interim[m++] = f, p <<= 6, p |= f & 63;
      }
      _2 || (A === 2 ? p < 128 ? h2-- : e[r++] = p : A === 3 ? p < 2048 || p >= 55296 && p <= 57343 || p === 65279 || (e[r++] = p) : p < 65536 || p > 1114111 || (e[r++] = p)), this.interim.fill(0);
    }
    let c = i - 4, d = h2;
    for (; d < i; ) {
      for (; d < c && !((n = t2[d]) & 128) && !((o2 = t2[d + 1]) & 128) && !((l = t2[d + 2]) & 128) && !((a = t2[d + 3]) & 128); ) e[r++] = n, e[r++] = o2, e[r++] = l, e[r++] = a, d += 4;
      if (n = t2[d++], n < 128) e[r++] = n;
      else if ((n & 224) === 192) {
        if (d >= i) return this.interim[0] = n, r;
        if (o2 = t2[d++], (o2 & 192) !== 128) {
          d--;
          continue;
        }
        if (u = (n & 31) << 6 | o2 & 63, u < 128) {
          d--;
          continue;
        }
        e[r++] = u;
      } else if ((n & 240) === 224) {
        if (d >= i) return this.interim[0] = n, r;
        if (o2 = t2[d++], (o2 & 192) !== 128) {
          d--;
          continue;
        }
        if (d >= i) return this.interim[0] = n, this.interim[1] = o2, r;
        if (l = t2[d++], (l & 192) !== 128) {
          d--;
          continue;
        }
        if (u = (n & 15) << 12 | (o2 & 63) << 6 | l & 63, u < 2048 || u >= 55296 && u <= 57343 || u === 65279) continue;
        e[r++] = u;
      } else if ((n & 248) === 240) {
        if (d >= i) return this.interim[0] = n, r;
        if (o2 = t2[d++], (o2 & 192) !== 128) {
          d--;
          continue;
        }
        if (d >= i) return this.interim[0] = n, this.interim[1] = o2, r;
        if (l = t2[d++], (l & 192) !== 128) {
          d--;
          continue;
        }
        if (d >= i) return this.interim[0] = n, this.interim[1] = o2, this.interim[2] = l, r;
        if (a = t2[d++], (a & 192) !== 128) {
          d--;
          continue;
        }
        if (u = (n & 7) << 18 | (o2 & 63) << 12 | (l & 63) << 6 | a & 63, u < 65536 || u > 1114111) continue;
        e[r++] = u;
      }
    }
    return r;
  }
};
var ir = "";
var we = " ";
var De = class s {
  constructor() {
    this.fg = 0;
    this.bg = 0;
    this.extended = new rt();
  }
  static toColorRGB(t2) {
    return [t2 >>> 16 & 255, t2 >>> 8 & 255, t2 & 255];
  }
  static fromColorRGB(t2) {
    return (t2[0] & 255) << 16 | (t2[1] & 255) << 8 | t2[2] & 255;
  }
  clone() {
    let t2 = new s();
    return t2.fg = this.fg, t2.bg = this.bg, t2.extended = this.extended.clone(), t2;
  }
  isInverse() {
    return this.fg & 67108864;
  }
  isBold() {
    return this.fg & 134217728;
  }
  isUnderline() {
    return this.hasExtendedAttrs() && this.extended.underlineStyle !== 0 ? 1 : this.fg & 268435456;
  }
  isBlink() {
    return this.fg & 536870912;
  }
  isInvisible() {
    return this.fg & 1073741824;
  }
  isItalic() {
    return this.bg & 67108864;
  }
  isDim() {
    return this.bg & 134217728;
  }
  isStrikethrough() {
    return this.fg & 2147483648;
  }
  isProtected() {
    return this.bg & 536870912;
  }
  isOverline() {
    return this.bg & 1073741824;
  }
  getFgColorMode() {
    return this.fg & 50331648;
  }
  getBgColorMode() {
    return this.bg & 50331648;
  }
  isFgRGB() {
    return (this.fg & 50331648) === 50331648;
  }
  isBgRGB() {
    return (this.bg & 50331648) === 50331648;
  }
  isFgPalette() {
    return (this.fg & 50331648) === 16777216 || (this.fg & 50331648) === 33554432;
  }
  isBgPalette() {
    return (this.bg & 50331648) === 16777216 || (this.bg & 50331648) === 33554432;
  }
  isFgDefault() {
    return (this.fg & 50331648) === 0;
  }
  isBgDefault() {
    return (this.bg & 50331648) === 0;
  }
  isAttributeDefault() {
    return this.fg === 0 && this.bg === 0;
  }
  getFgColor() {
    switch (this.fg & 50331648) {
      case 16777216:
      case 33554432:
        return this.fg & 255;
      case 50331648:
        return this.fg & 16777215;
      default:
        return -1;
    }
  }
  getBgColor() {
    switch (this.bg & 50331648) {
      case 16777216:
      case 33554432:
        return this.bg & 255;
      case 50331648:
        return this.bg & 16777215;
      default:
        return -1;
    }
  }
  hasExtendedAttrs() {
    return this.bg & 268435456;
  }
  updateExtended() {
    this.extended.isEmpty() ? this.bg &= -268435457 : this.bg |= 268435456;
  }
  getUnderlineColor() {
    if (this.bg & 268435456 && ~this.extended.underlineColor) switch (this.extended.underlineColor & 50331648) {
      case 16777216:
      case 33554432:
        return this.extended.underlineColor & 255;
      case 50331648:
        return this.extended.underlineColor & 16777215;
      default:
        return this.getFgColor();
    }
    return this.getFgColor();
  }
  getUnderlineColorMode() {
    return this.bg & 268435456 && ~this.extended.underlineColor ? this.extended.underlineColor & 50331648 : this.getFgColorMode();
  }
  isUnderlineColorRGB() {
    return this.bg & 268435456 && ~this.extended.underlineColor ? (this.extended.underlineColor & 50331648) === 50331648 : this.isFgRGB();
  }
  isUnderlineColorPalette() {
    return this.bg & 268435456 && ~this.extended.underlineColor ? (this.extended.underlineColor & 50331648) === 16777216 || (this.extended.underlineColor & 50331648) === 33554432 : this.isFgPalette();
  }
  isUnderlineColorDefault() {
    return this.bg & 268435456 && ~this.extended.underlineColor ? (this.extended.underlineColor & 50331648) === 0 : this.isFgDefault();
  }
  getUnderlineStyle() {
    return this.fg & 268435456 ? this.bg & 268435456 ? this.extended.underlineStyle : 1 : 0;
  }
  getUnderlineVariantOffset() {
    return this.extended.underlineVariantOffset;
  }
};
var rt = class s2 {
  constructor(t2 = 0, e = 0) {
    this._ext = 0;
    this._urlId = 0;
    this._ext = t2, this._urlId = e;
  }
  get ext() {
    return this._urlId ? this._ext & -469762049 | this.underlineStyle << 26 : this._ext;
  }
  set ext(t2) {
    this._ext = t2;
  }
  get underlineStyle() {
    return this._urlId ? 5 : (this._ext & 469762048) >> 26;
  }
  set underlineStyle(t2) {
    this._ext &= -469762049, this._ext |= t2 << 26 & 469762048;
  }
  get underlineColor() {
    return this._ext & 67108863;
  }
  set underlineColor(t2) {
    this._ext &= -67108864, this._ext |= t2 & 67108863;
  }
  get urlId() {
    return this._urlId;
  }
  set urlId(t2) {
    this._urlId = t2;
  }
  get underlineVariantOffset() {
    let t2 = (this._ext & 3758096384) >> 29;
    return t2 < 0 ? t2 ^ 4294967288 : t2;
  }
  set underlineVariantOffset(t2) {
    this._ext &= 536870911, this._ext |= t2 << 29 & 3758096384;
  }
  clone() {
    return new s2(this._ext, this._urlId);
  }
  isEmpty() {
    return this.underlineStyle === 0 && this._urlId === 0;
  }
};
var q = class s3 extends De {
  constructor() {
    super(...arguments);
    this.content = 0;
    this.fg = 0;
    this.bg = 0;
    this.extended = new rt();
    this.combinedData = "";
  }
  static fromCharData(e) {
    let i = new s3();
    return i.setFromCharData(e), i;
  }
  isCombined() {
    return this.content & 2097152;
  }
  getWidth() {
    return this.content >> 22;
  }
  getChars() {
    return this.content & 2097152 ? this.combinedData : this.content & 2097151 ? Ce(this.content & 2097151) : "";
  }
  getCode() {
    return this.isCombined() ? this.combinedData.charCodeAt(this.combinedData.length - 1) : this.content & 2097151;
  }
  setFromCharData(e) {
    this.fg = e[0], this.bg = 0;
    let i = false;
    if (e[1].length > 2) i = true;
    else if (e[1].length === 2) {
      let r = e[1].charCodeAt(0);
      if (55296 <= r && r <= 56319) {
        let n = e[1].charCodeAt(1);
        56320 <= n && n <= 57343 ? this.content = (r - 55296) * 1024 + n - 56320 + 65536 | e[2] << 22 : i = true;
      } else i = true;
    } else this.content = e[1].charCodeAt(0) | e[2] << 22;
    i && (this.combinedData = e[1], this.content = 2097152 | e[2] << 22);
  }
  getAsCharData() {
    return [this.fg, this.getChars(), this.getWidth(), this.getCode()];
  }
};
var js = "di$target";
var Hn = "di$dependencies";
var Fn = /* @__PURE__ */ new Map();
function Xs(s15) {
  return s15[Hn] || [];
}
function ie(s15) {
  if (Fn.has(s15)) return Fn.get(s15);
  let t2 = function(e, i, r) {
    if (arguments.length !== 3) throw new Error("@IServiceName-decorator can only be used to decorate a parameter");
    Pl(t2, e, r);
  };
  return t2._id = s15, Fn.set(s15, t2), t2;
}
function Pl(s15, t2, e) {
  t2[js] === t2 ? t2[Hn].push({ id: s15, index: e }) : (t2[Hn] = [{ id: s15, index: e }], t2[js] = t2);
}
var F = ie("BufferService");
var rr = ie("CoreMouseService");
var ge = ie("CoreService");
var Zs = ie("CharsetService");
var xt = ie("InstantiationService");
var nr = ie("LogService");
var H = ie("OptionsService");
var sr = ie("OscLinkService");
var Js = ie("UnicodeService");
var Be = ie("DecorationService");
var wt = class {
  constructor(t2, e, i) {
    this._bufferService = t2;
    this._optionsService = e;
    this._oscLinkService = i;
  }
  provideLinks(t2, e) {
    let i = this._bufferService.buffer.lines.get(t2 - 1);
    if (!i) {
      e(void 0);
      return;
    }
    let r = [], n = this._optionsService.rawOptions.linkHandler, o2 = new q(), l = i.getTrimmedLength(), a = -1, u = -1, h2 = false;
    for (let c = 0; c < l; c++) if (!(u === -1 && !i.hasContent(c))) {
      if (i.loadCell(c, o2), o2.hasExtendedAttrs() && o2.extended.urlId) if (u === -1) {
        u = c, a = o2.extended.urlId;
        continue;
      } else h2 = o2.extended.urlId !== a;
      else u !== -1 && (h2 = true);
      if (h2 || u !== -1 && c === l - 1) {
        let d = this._oscLinkService.getLinkData(a)?.uri;
        if (d) {
          let _2 = { start: { x: u + 1, y: t2 }, end: { x: c + (!h2 && c === l - 1 ? 1 : 0), y: t2 } }, p = false;
          if (!n?.allowNonHttpProtocols) try {
            let m = new URL(d);
            ["http:", "https:"].includes(m.protocol) || (p = true);
          } catch {
            p = true;
          }
          p || r.push({ text: d, range: _2, activate: (m, f) => n ? n.activate(m, f, _2) : Ol(m, f), hover: (m, f) => n?.hover?.(m, f, _2), leave: (m, f) => n?.leave?.(m, f, _2) });
        }
        h2 = false, o2.hasExtendedAttrs() && o2.extended.urlId ? (u = c, a = o2.extended.urlId) : (u = -1, a = -1);
      }
    }
    e(r);
  }
};
wt = M([S(0, F), S(1, H), S(2, sr)], wt);
function Ol(s15, t2) {
  if (confirm(`Do you want to navigate to ${t2}?

WARNING: This link could potentially be dangerous`)) {
    let i = window.open();
    if (i) {
      try {
        i.opener = null;
      } catch {
      }
      i.location.href = t2;
    } else console.warn("Opening link blocked as opener could not be cleared");
  }
}
var nt = ie("CharSizeService");
var ae = ie("CoreBrowserService");
var Dt = ie("MouseService");
var ce = ie("RenderService");
var Qs = ie("SelectionService");
var or = ie("CharacterJoinerService");
var Re = ie("ThemeService");
var lr = ie("LinkProviderService");
var Wn = class {
  constructor() {
    this.listeners = [], this.unexpectedErrorHandler = function(t2) {
      setTimeout(() => {
        throw t2.stack ? ar.isErrorNoTelemetry(t2) ? new ar(t2.message + `

` + t2.stack) : new Error(t2.message + `

` + t2.stack) : t2;
      }, 0);
    };
  }
  addListener(t2) {
    return this.listeners.push(t2), () => {
      this._removeListener(t2);
    };
  }
  emit(t2) {
    this.listeners.forEach((e) => {
      e(t2);
    });
  }
  _removeListener(t2) {
    this.listeners.splice(this.listeners.indexOf(t2), 1);
  }
  setUnexpectedErrorHandler(t2) {
    this.unexpectedErrorHandler = t2;
  }
  getUnexpectedErrorHandler() {
    return this.unexpectedErrorHandler;
  }
  onUnexpectedError(t2) {
    this.unexpectedErrorHandler(t2), this.emit(t2);
  }
  onUnexpectedExternalError(t2) {
    this.unexpectedErrorHandler(t2);
  }
};
var Bl = new Wn();
function Lt(s15) {
  Nl(s15) || Bl.onUnexpectedError(s15);
}
var Un = "Canceled";
function Nl(s15) {
  return s15 instanceof bi ? true : s15 instanceof Error && s15.name === Un && s15.message === Un;
}
var bi = class extends Error {
  constructor() {
    super(Un), this.name = this.message;
  }
};
function eo(s15) {
  return s15 ? new Error(`Illegal argument: ${s15}`) : new Error("Illegal argument");
}
var ar = class s4 extends Error {
  constructor(t2) {
    super(t2), this.name = "CodeExpectedError";
  }
  static fromError(t2) {
    if (t2 instanceof s4) return t2;
    let e = new s4();
    return e.message = t2.message, e.stack = t2.stack, e;
  }
  static isErrorNoTelemetry(t2) {
    return t2.name === "CodeExpectedError";
  }
};
var Rt = class s5 extends Error {
  constructor(t2) {
    super(t2 || "An unexpected bug occurred."), Object.setPrototypeOf(this, s5.prototype);
  }
};
function Fl(s15, t2, e = 0, i = s15.length) {
  let r = e, n = i;
  for (; r < n; ) {
    let o2 = Math.floor((r + n) / 2);
    t2(s15[o2]) ? r = o2 + 1 : n = o2;
  }
  return r - 1;
}
var cr = class cr2 {
  constructor(t2) {
    this._array = t2;
    this._findLastMonotonousLastIdx = 0;
  }
  findLastMonotonous(t2) {
    if (cr2.assertInvariants) {
      if (this._prevFindLastPredicate) {
        for (let i of this._array) if (this._prevFindLastPredicate(i) && !t2(i)) throw new Error("MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.");
      }
      this._prevFindLastPredicate = t2;
    }
    let e = Fl(this._array, t2, this._findLastMonotonousLastIdx);
    return this._findLastMonotonousLastIdx = e + 1, e === -1 ? void 0 : this._array[e];
  }
};
cr.assertInvariants = false;
function Se(s15, t2 = 0) {
  return s15[s15.length - (1 + t2)];
}
var ro;
((l) => {
  function s15(a) {
    return a < 0;
  }
  l.isLessThan = s15;
  function t2(a) {
    return a <= 0;
  }
  l.isLessThanOrEqual = t2;
  function e(a) {
    return a > 0;
  }
  l.isGreaterThan = e;
  function i(a) {
    return a === 0;
  }
  l.isNeitherLessOrGreaterThan = i, l.greaterThan = 1, l.lessThan = -1, l.neitherLessOrGreaterThan = 0;
})(ro ||= {});
function no(s15, t2) {
  return (e, i) => t2(s15(e), s15(i));
}
var so = (s15, t2) => s15 - t2;
var At = class At2 {
  constructor(t2) {
    this.iterate = t2;
  }
  forEach(t2) {
    this.iterate((e) => (t2(e), true));
  }
  toArray() {
    let t2 = [];
    return this.iterate((e) => (t2.push(e), true)), t2;
  }
  filter(t2) {
    return new At2((e) => this.iterate((i) => t2(i) ? e(i) : true));
  }
  map(t2) {
    return new At2((e) => this.iterate((i) => e(t2(i))));
  }
  some(t2) {
    let e = false;
    return this.iterate((i) => (e = t2(i), !e)), e;
  }
  findFirst(t2) {
    let e;
    return this.iterate((i) => t2(i) ? (e = i, false) : true), e;
  }
  findLast(t2) {
    let e;
    return this.iterate((i) => (t2(i) && (e = i), true)), e;
  }
  findLastMaxBy(t2) {
    let e, i = true;
    return this.iterate((r) => ((i || ro.isGreaterThan(t2(r, e))) && (i = false, e = r), true)), e;
  }
};
At.empty = new At((t2) => {
});
function co(s15, t2) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let i of s15) {
    let r = t2(i), n = e[r];
    n || (n = e[r] = []), n.push(i);
  }
  return e;
}
var lo;
var ao;
var oo = class {
  constructor(t2, e) {
    this.toKey = e;
    this._map = /* @__PURE__ */ new Map();
    this[lo] = "SetWithKey";
    for (let i of t2) this.add(i);
  }
  get size() {
    return this._map.size;
  }
  add(t2) {
    let e = this.toKey(t2);
    return this._map.set(e, t2), this;
  }
  delete(t2) {
    return this._map.delete(this.toKey(t2));
  }
  has(t2) {
    return this._map.has(this.toKey(t2));
  }
  *entries() {
    for (let t2 of this._map.values()) yield [t2, t2];
  }
  keys() {
    return this.values();
  }
  *values() {
    for (let t2 of this._map.values()) yield t2;
  }
  clear() {
    this._map.clear();
  }
  forEach(t2, e) {
    this._map.forEach((i) => t2.call(e, i, i, this));
  }
  [(ao = Symbol.iterator, lo = Symbol.toStringTag, ao)]() {
    return this.values();
  }
};
var ur = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  add(t2, e) {
    let i = this.map.get(t2);
    i || (i = /* @__PURE__ */ new Set(), this.map.set(t2, i)), i.add(e);
  }
  delete(t2, e) {
    let i = this.map.get(t2);
    i && (i.delete(e), i.size === 0 && this.map.delete(t2));
  }
  forEach(t2, e) {
    let i = this.map.get(t2);
    i && i.forEach(e);
  }
  get(t2) {
    let e = this.map.get(t2);
    return e || /* @__PURE__ */ new Set();
  }
};
function Kn(s15, t2) {
  let e = this, i = false, r;
  return function() {
    if (i) return r;
    if (i = true, t2) try {
      r = s15.apply(e, arguments);
    } finally {
      t2();
    }
    else r = s15.apply(e, arguments);
    return r;
  };
}
var zn;
((O) => {
  function s15(I) {
    return I && typeof I == "object" && typeof I[Symbol.iterator] == "function";
  }
  O.is = s15;
  let t2 = Object.freeze([]);
  function e() {
    return t2;
  }
  O.empty = e;
  function* i(I) {
    yield I;
  }
  O.single = i;
  function r(I) {
    return s15(I) ? I : i(I);
  }
  O.wrap = r;
  function n(I) {
    return I || t2;
  }
  O.from = n;
  function* o2(I) {
    for (let k = I.length - 1; k >= 0; k--) yield I[k];
  }
  O.reverse = o2;
  function l(I) {
    return !I || I[Symbol.iterator]().next().done === true;
  }
  O.isEmpty = l;
  function a(I) {
    return I[Symbol.iterator]().next().value;
  }
  O.first = a;
  function u(I, k) {
    let P = 0;
    for (let oe of I) if (k(oe, P++)) return true;
    return false;
  }
  O.some = u;
  function h2(I, k) {
    for (let P of I) if (k(P)) return P;
  }
  O.find = h2;
  function* c(I, k) {
    for (let P of I) k(P) && (yield P);
  }
  O.filter = c;
  function* d(I, k) {
    let P = 0;
    for (let oe of I) yield k(oe, P++);
  }
  O.map = d;
  function* _2(I, k) {
    let P = 0;
    for (let oe of I) yield* k(oe, P++);
  }
  O.flatMap = _2;
  function* p(...I) {
    for (let k of I) yield* k;
  }
  O.concat = p;
  function m(I, k, P) {
    let oe = P;
    for (let Me of I) oe = k(oe, Me);
    return oe;
  }
  O.reduce = m;
  function* f(I, k, P = I.length) {
    for (k < 0 && (k += I.length), P < 0 ? P += I.length : P > I.length && (P = I.length); k < P; k++) yield I[k];
  }
  O.slice = f;
  function A(I, k = Number.POSITIVE_INFINITY) {
    let P = [];
    if (k === 0) return [P, I];
    let oe = I[Symbol.iterator]();
    for (let Me = 0; Me < k; Me++) {
      let Pe = oe.next();
      if (Pe.done) return [P, O.empty()];
      P.push(Pe.value);
    }
    return [P, { [Symbol.iterator]() {
      return oe;
    } }];
  }
  O.consume = A;
  async function R(I) {
    let k = [];
    for await (let P of I) k.push(P);
    return Promise.resolve(k);
  }
  O.asyncToArray = R;
})(zn ||= {});
var Wl = false;
var dt = null;
var hr = class hr2 {
  constructor() {
    this.livingDisposables = /* @__PURE__ */ new Map();
  }
  getDisposableData(t2) {
    let e = this.livingDisposables.get(t2);
    return e || (e = { parent: null, source: null, isSingleton: false, value: t2, idx: hr2.idx++ }, this.livingDisposables.set(t2, e)), e;
  }
  trackDisposable(t2) {
    let e = this.getDisposableData(t2);
    e.source || (e.source = new Error().stack);
  }
  setParent(t2, e) {
    let i = this.getDisposableData(t2);
    i.parent = e;
  }
  markAsDisposed(t2) {
    this.livingDisposables.delete(t2);
  }
  markAsSingleton(t2) {
    this.getDisposableData(t2).isSingleton = true;
  }
  getRootParent(t2, e) {
    let i = e.get(t2);
    if (i) return i;
    let r = t2.parent ? this.getRootParent(this.getDisposableData(t2.parent), e) : t2;
    return e.set(t2, r), r;
  }
  getTrackedDisposables() {
    let t2 = /* @__PURE__ */ new Map();
    return [...this.livingDisposables.entries()].filter(([, i]) => i.source !== null && !this.getRootParent(i, t2).isSingleton).flatMap(([i]) => i);
  }
  computeLeakingDisposables(t2 = 10, e) {
    let i;
    if (e) i = e;
    else {
      let a = /* @__PURE__ */ new Map(), u = [...this.livingDisposables.values()].filter((c) => c.source !== null && !this.getRootParent(c, a).isSingleton);
      if (u.length === 0) return;
      let h2 = new Set(u.map((c) => c.value));
      if (i = u.filter((c) => !(c.parent && h2.has(c.parent))), i.length === 0) throw new Error("There are cyclic diposable chains!");
    }
    if (!i) return;
    function r(a) {
      function u(c, d) {
        for (; c.length > 0 && d.some((_2) => typeof _2 == "string" ? _2 === c[0] : c[0].match(_2)); ) c.shift();
      }
      let h2 = a.source.split(`
`).map((c) => c.trim().replace("at ", "")).filter((c) => c !== "");
      return u(h2, ["Error", /^trackDisposable \(.*\)$/, /^DisposableTracker.trackDisposable \(.*\)$/]), h2.reverse();
    }
    let n = new ur();
    for (let a of i) {
      let u = r(a);
      for (let h2 = 0; h2 <= u.length; h2++) n.add(u.slice(0, h2).join(`
`), a);
    }
    i.sort(no((a) => a.idx, so));
    let o2 = "", l = 0;
    for (let a of i.slice(0, t2)) {
      l++;
      let u = r(a), h2 = [];
      for (let c = 0; c < u.length; c++) {
        let d = u[c];
        d = `(shared with ${n.get(u.slice(0, c + 1).join(`
`)).size}/${i.length} leaks) at ${d}`;
        let p = n.get(u.slice(0, c).join(`
`)), m = co([...p].map((f) => r(f)[c]), (f) => f);
        delete m[u[c]];
        for (let [f, A] of Object.entries(m)) h2.unshift(`    - stacktraces of ${A.length} other leaks continue with ${f}`);
        h2.unshift(d);
      }
      o2 += `


==================== Leaking disposable ${l}/${i.length}: ${a.value.constructor.name} ====================
${h2.join(`
`)}
============================================================

`;
    }
    return i.length > t2 && (o2 += `


... and ${i.length - t2} more leaking disposables

`), { leaks: i, details: o2 };
  }
};
hr.idx = 0;
function Ul(s15) {
  dt = s15;
}
if (Wl) {
  let s15 = "__is_disposable_tracked__";
  Ul(new class {
    trackDisposable(t2) {
      let e = new Error("Potentially leaked disposable").stack;
      setTimeout(() => {
        t2[s15] || console.log(e);
      }, 3e3);
    }
    setParent(t2, e) {
      if (t2 && t2 !== D.None) try {
        t2[s15] = true;
      } catch {
      }
    }
    markAsDisposed(t2) {
      if (t2 && t2 !== D.None) try {
        t2[s15] = true;
      } catch {
      }
    }
    markAsSingleton(t2) {
    }
  }());
}
function fr(s15) {
  return dt?.trackDisposable(s15), s15;
}
function pr(s15) {
  dt?.markAsDisposed(s15);
}
function vi(s15, t2) {
  dt?.setParent(s15, t2);
}
function Kl(s15, t2) {
  if (dt) for (let e of s15) dt.setParent(e, t2);
}
function Gn(s15) {
  return dt?.markAsSingleton(s15), s15;
}
function Ne(s15) {
  if (zn.is(s15)) {
    let t2 = [];
    for (let e of s15) if (e) try {
      e.dispose();
    } catch (i) {
      t2.push(i);
    }
    if (t2.length === 1) throw t2[0];
    if (t2.length > 1) throw new AggregateError(t2, "Encountered errors while disposing of store");
    return Array.isArray(s15) ? [] : s15;
  } else if (s15) return s15.dispose(), s15;
}
function ho(...s15) {
  let t2 = C(() => Ne(s15));
  return Kl(s15, t2), t2;
}
function C(s15) {
  let t2 = fr({ dispose: Kn(() => {
    pr(t2), s15();
  }) });
  return t2;
}
var dr = class dr2 {
  constructor() {
    this._toDispose = /* @__PURE__ */ new Set();
    this._isDisposed = false;
    fr(this);
  }
  dispose() {
    this._isDisposed || (pr(this), this._isDisposed = true, this.clear());
  }
  get isDisposed() {
    return this._isDisposed;
  }
  clear() {
    if (this._toDispose.size !== 0) try {
      Ne(this._toDispose);
    } finally {
      this._toDispose.clear();
    }
  }
  add(t2) {
    if (!t2) return t2;
    if (t2 === this) throw new Error("Cannot register a disposable on itself!");
    return vi(t2, this), this._isDisposed ? dr2.DISABLE_DISPOSED_WARNING || console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack) : this._toDispose.add(t2), t2;
  }
  delete(t2) {
    if (t2) {
      if (t2 === this) throw new Error("Cannot dispose a disposable on itself!");
      this._toDispose.delete(t2), t2.dispose();
    }
  }
  deleteAndLeak(t2) {
    t2 && this._toDispose.has(t2) && (this._toDispose.delete(t2), vi(t2, null));
  }
};
dr.DISABLE_DISPOSED_WARNING = false;
var Ee = dr;
var D = class {
  constructor() {
    this._store = new Ee();
    fr(this), vi(this._store, this);
  }
  dispose() {
    pr(this), this._store.dispose();
  }
  _register(t2) {
    if (t2 === this) throw new Error("Cannot register a disposable on itself!");
    return this._store.add(t2);
  }
};
D.None = Object.freeze({ dispose() {
} });
var ye = class {
  constructor() {
    this._isDisposed = false;
    fr(this);
  }
  get value() {
    return this._isDisposed ? void 0 : this._value;
  }
  set value(t2) {
    this._isDisposed || t2 === this._value || (this._value?.dispose(), t2 && vi(t2, this), this._value = t2);
  }
  clear() {
    this.value = void 0;
  }
  dispose() {
    this._isDisposed = true, pr(this), this._value?.dispose(), this._value = void 0;
  }
  clearAndLeak() {
    let t2 = this._value;
    return this._value = void 0, t2 && vi(t2, null), t2;
  }
};
var fe = typeof window == "object" ? window : globalThis;
var kt = class kt2 {
  constructor(t2) {
    this.element = t2, this.next = kt2.Undefined, this.prev = kt2.Undefined;
  }
};
kt.Undefined = new kt(void 0);
var G = kt;
var Ct = class {
  constructor() {
    this._first = G.Undefined;
    this._last = G.Undefined;
    this._size = 0;
  }
  get size() {
    return this._size;
  }
  isEmpty() {
    return this._first === G.Undefined;
  }
  clear() {
    let t2 = this._first;
    for (; t2 !== G.Undefined; ) {
      let e = t2.next;
      t2.prev = G.Undefined, t2.next = G.Undefined, t2 = e;
    }
    this._first = G.Undefined, this._last = G.Undefined, this._size = 0;
  }
  unshift(t2) {
    return this._insert(t2, false);
  }
  push(t2) {
    return this._insert(t2, true);
  }
  _insert(t2, e) {
    let i = new G(t2);
    if (this._first === G.Undefined) this._first = i, this._last = i;
    else if (e) {
      let n = this._last;
      this._last = i, i.prev = n, n.next = i;
    } else {
      let n = this._first;
      this._first = i, i.next = n, n.prev = i;
    }
    this._size += 1;
    let r = false;
    return () => {
      r || (r = true, this._remove(i));
    };
  }
  shift() {
    if (this._first !== G.Undefined) {
      let t2 = this._first.element;
      return this._remove(this._first), t2;
    }
  }
  pop() {
    if (this._last !== G.Undefined) {
      let t2 = this._last.element;
      return this._remove(this._last), t2;
    }
  }
  _remove(t2) {
    if (t2.prev !== G.Undefined && t2.next !== G.Undefined) {
      let e = t2.prev;
      e.next = t2.next, t2.next.prev = e;
    } else t2.prev === G.Undefined && t2.next === G.Undefined ? (this._first = G.Undefined, this._last = G.Undefined) : t2.next === G.Undefined ? (this._last = this._last.prev, this._last.next = G.Undefined) : t2.prev === G.Undefined && (this._first = this._first.next, this._first.prev = G.Undefined);
    this._size -= 1;
  }
  *[Symbol.iterator]() {
    let t2 = this._first;
    for (; t2 !== G.Undefined; ) yield t2.element, t2 = t2.next;
  }
};
var zl = globalThis.performance && typeof globalThis.performance.now == "function";
var mr = class s6 {
  static create(t2) {
    return new s6(t2);
  }
  constructor(t2) {
    this._now = zl && t2 === false ? Date.now : globalThis.performance.now.bind(globalThis.performance), this._startTime = this._now(), this._stopTime = -1;
  }
  stop() {
    this._stopTime = this._now();
  }
  reset() {
    this._startTime = this._now(), this._stopTime = -1;
  }
  elapsed() {
    return this._stopTime !== -1 ? this._stopTime - this._startTime : this._now() - this._startTime;
  }
};
var Gl = false;
var fo = false;
var $l = false;
var $;
((Qe) => {
  Qe.None = () => D.None;
  function t2(y) {
    if ($l) {
      let { onDidAddListener: T } = y, g = gi.create(), w = 0;
      y.onDidAddListener = () => {
        ++w === 2 && (console.warn("snapshotted emitter LIKELY used public and SHOULD HAVE BEEN created with DisposableStore. snapshotted here"), g.print()), T?.();
      };
    }
  }
  function e(y, T) {
    return d(y, () => {
    }, 0, void 0, true, void 0, T);
  }
  Qe.defer = e;
  function i(y) {
    return (T, g = null, w) => {
      let E = false, x;
      return x = y((N) => {
        if (!E) return x ? x.dispose() : E = true, T.call(g, N);
      }, null, w), E && x.dispose(), x;
    };
  }
  Qe.once = i;
  function r(y, T, g) {
    return h2((w, E = null, x) => y((N) => w.call(E, T(N)), null, x), g);
  }
  Qe.map = r;
  function n(y, T, g) {
    return h2((w, E = null, x) => y((N) => {
      T(N), w.call(E, N);
    }, null, x), g);
  }
  Qe.forEach = n;
  function o2(y, T, g) {
    return h2((w, E = null, x) => y((N) => T(N) && w.call(E, N), null, x), g);
  }
  Qe.filter = o2;
  function l(y) {
    return y;
  }
  Qe.signal = l;
  function a(...y) {
    return (T, g = null, w) => {
      let E = ho(...y.map((x) => x((N) => T.call(g, N))));
      return c(E, w);
    };
  }
  Qe.any = a;
  function u(y, T, g, w) {
    let E = g;
    return r(y, (x) => (E = T(E, x), E), w);
  }
  Qe.reduce = u;
  function h2(y, T) {
    let g, w = { onWillAddFirstListener() {
      g = y(E.fire, E);
    }, onDidRemoveLastListener() {
      g?.dispose();
    } };
    T || t2(w);
    let E = new v(w);
    return T?.add(E), E.event;
  }
  function c(y, T) {
    return T instanceof Array ? T.push(y) : T && T.add(y), y;
  }
  function d(y, T, g = 100, w = false, E = false, x, N) {
    let Z, te, Oe, ze = 0, le, et = { leakWarningThreshold: x, onWillAddFirstListener() {
      Z = y((ht) => {
        ze++, te = T(te, ht), w && !Oe && (me.fire(te), te = void 0), le = () => {
          let fi = te;
          te = void 0, Oe = void 0, (!w || ze > 1) && me.fire(fi), ze = 0;
        }, typeof g == "number" ? (clearTimeout(Oe), Oe = setTimeout(le, g)) : Oe === void 0 && (Oe = 0, queueMicrotask(le));
      });
    }, onWillRemoveListener() {
      E && ze > 0 && le?.();
    }, onDidRemoveLastListener() {
      le = void 0, Z.dispose();
    } };
    N || t2(et);
    let me = new v(et);
    return N?.add(me), me.event;
  }
  Qe.debounce = d;
  function _2(y, T = 0, g) {
    return Qe.debounce(y, (w, E) => w ? (w.push(E), w) : [E], T, void 0, true, void 0, g);
  }
  Qe.accumulate = _2;
  function p(y, T = (w, E) => w === E, g) {
    let w = true, E;
    return o2(y, (x) => {
      let N = w || !T(x, E);
      return w = false, E = x, N;
    }, g);
  }
  Qe.latch = p;
  function m(y, T, g) {
    return [Qe.filter(y, T, g), Qe.filter(y, (w) => !T(w), g)];
  }
  Qe.split = m;
  function f(y, T = false, g = [], w) {
    let E = g.slice(), x = y((te) => {
      E ? E.push(te) : Z.fire(te);
    });
    w && w.add(x);
    let N = () => {
      E?.forEach((te) => Z.fire(te)), E = null;
    }, Z = new v({ onWillAddFirstListener() {
      x || (x = y((te) => Z.fire(te)), w && w.add(x));
    }, onDidAddFirstListener() {
      E && (T ? setTimeout(N) : N());
    }, onDidRemoveLastListener() {
      x && x.dispose(), x = null;
    } });
    return w && w.add(Z), Z.event;
  }
  Qe.buffer = f;
  function A(y, T) {
    return (w, E, x) => {
      let N = T(new O());
      return y(function(Z) {
        let te = N.evaluate(Z);
        te !== R && w.call(E, te);
      }, void 0, x);
    };
  }
  Qe.chain = A;
  let R = /* @__PURE__ */ Symbol("HaltChainable");
  class O {
    constructor() {
      this.steps = [];
    }
    map(T) {
      return this.steps.push(T), this;
    }
    forEach(T) {
      return this.steps.push((g) => (T(g), g)), this;
    }
    filter(T) {
      return this.steps.push((g) => T(g) ? g : R), this;
    }
    reduce(T, g) {
      let w = g;
      return this.steps.push((E) => (w = T(w, E), w)), this;
    }
    latch(T = (g, w) => g === w) {
      let g = true, w;
      return this.steps.push((E) => {
        let x = g || !T(E, w);
        return g = false, w = E, x ? E : R;
      }), this;
    }
    evaluate(T) {
      for (let g of this.steps) if (T = g(T), T === R) break;
      return T;
    }
  }
  function I(y, T, g = (w) => w) {
    let w = (...Z) => N.fire(g(...Z)), E = () => y.on(T, w), x = () => y.removeListener(T, w), N = new v({ onWillAddFirstListener: E, onDidRemoveLastListener: x });
    return N.event;
  }
  Qe.fromNodeEventEmitter = I;
  function k(y, T, g = (w) => w) {
    let w = (...Z) => N.fire(g(...Z)), E = () => y.addEventListener(T, w), x = () => y.removeEventListener(T, w), N = new v({ onWillAddFirstListener: E, onDidRemoveLastListener: x });
    return N.event;
  }
  Qe.fromDOMEventEmitter = k;
  function P(y) {
    return new Promise((T) => i(y)(T));
  }
  Qe.toPromise = P;
  function oe(y) {
    let T = new v();
    return y.then((g) => {
      T.fire(g);
    }, () => {
      T.fire(void 0);
    }).finally(() => {
      T.dispose();
    }), T.event;
  }
  Qe.fromPromise = oe;
  function Me(y, T) {
    return y((g) => T.fire(g));
  }
  Qe.forward = Me;
  function Pe(y, T, g) {
    return T(g), y((w) => T(w));
  }
  Qe.runAndSubscribe = Pe;
  class Ke {
    constructor(T, g) {
      this._observable = T;
      this._counter = 0;
      this._hasChanged = false;
      let w = { onWillAddFirstListener: () => {
        T.addObserver(this);
      }, onDidRemoveLastListener: () => {
        T.removeObserver(this);
      } };
      g || t2(w), this.emitter = new v(w), g && g.add(this.emitter);
    }
    beginUpdate(T) {
      this._counter++;
    }
    handlePossibleChange(T) {
    }
    handleChange(T, g) {
      this._hasChanged = true;
    }
    endUpdate(T) {
      this._counter--, this._counter === 0 && (this._observable.reportChanges(), this._hasChanged && (this._hasChanged = false, this.emitter.fire(this._observable.get())));
    }
  }
  function di(y, T) {
    return new Ke(y, T).emitter.event;
  }
  Qe.fromObservable = di;
  function V(y) {
    return (T, g, w) => {
      let E = 0, x = false, N = { beginUpdate() {
        E++;
      }, endUpdate() {
        E--, E === 0 && (y.reportChanges(), x && (x = false, T.call(g)));
      }, handlePossibleChange() {
      }, handleChange() {
        x = true;
      } };
      y.addObserver(N), y.reportChanges();
      let Z = { dispose() {
        y.removeObserver(N);
      } };
      return w instanceof Ee ? w.add(Z) : Array.isArray(w) && w.push(Z), Z;
    };
  }
  Qe.fromObservableLight = V;
})($ ||= {});
var Mt = class Mt2 {
  constructor(t2) {
    this.listenerCount = 0;
    this.invocationCount = 0;
    this.elapsedOverall = 0;
    this.durations = [];
    this.name = `${t2}_${Mt2._idPool++}`, Mt2.all.add(this);
  }
  start(t2) {
    this._stopWatch = new mr(), this.listenerCount = t2;
  }
  stop() {
    if (this._stopWatch) {
      let t2 = this._stopWatch.elapsed();
      this.durations.push(t2), this.elapsedOverall += t2, this.invocationCount += 1, this._stopWatch = void 0;
    }
  }
};
Mt.all = /* @__PURE__ */ new Set(), Mt._idPool = 0;
var $n = Mt;
var po = -1;
var br = class br2 {
  constructor(t2, e, i = (br2._idPool++).toString(16).padStart(3, "0")) {
    this._errorHandler = t2;
    this.threshold = e;
    this.name = i;
    this._warnCountdown = 0;
  }
  dispose() {
    this._stacks?.clear();
  }
  check(t2, e) {
    let i = this.threshold;
    if (i <= 0 || e < i) return;
    this._stacks || (this._stacks = /* @__PURE__ */ new Map());
    let r = this._stacks.get(t2.value) || 0;
    if (this._stacks.set(t2.value, r + 1), this._warnCountdown -= 1, this._warnCountdown <= 0) {
      this._warnCountdown = i * 0.5;
      let [n, o2] = this.getMostFrequentStack(), l = `[${this.name}] potential listener LEAK detected, having ${e} listeners already. MOST frequent listener (${o2}):`;
      console.warn(l), console.warn(n);
      let a = new qn(l, n);
      this._errorHandler(a);
    }
    return () => {
      let n = this._stacks.get(t2.value) || 0;
      this._stacks.set(t2.value, n - 1);
    };
  }
  getMostFrequentStack() {
    if (!this._stacks) return;
    let t2, e = 0;
    for (let [i, r] of this._stacks) (!t2 || e < r) && (t2 = [i, r], e = r);
    return t2;
  }
};
br._idPool = 1;
var Vn = br;
var gi = class s7 {
  constructor(t2) {
    this.value = t2;
  }
  static create() {
    let t2 = new Error();
    return new s7(t2.stack ?? "");
  }
  print() {
    console.warn(this.value.split(`
`).slice(2).join(`
`));
  }
};
var qn = class extends Error {
  constructor(t2, e) {
    super(t2), this.name = "ListenerLeakError", this.stack = e;
  }
};
var Yn = class extends Error {
  constructor(t2, e) {
    super(t2), this.name = "ListenerRefusalError", this.stack = e;
  }
};
var Vl = 0;
var Pt = class {
  constructor(t2) {
    this.value = t2;
    this.id = Vl++;
  }
};
var ql = 2;
var Yl = (s15, t2) => {
  if (s15 instanceof Pt) t2(s15);
  else for (let e = 0; e < s15.length; e++) {
    let i = s15[e];
    i && t2(i);
  }
};
var _r;
if (Gl) {
  let s15 = [];
  setInterval(() => {
    s15.length !== 0 && (console.warn("[LEAKING LISTENERS] GC'ed these listeners that were NOT yet disposed:"), console.warn(s15.join(`
`)), s15.length = 0);
  }, 3e3), _r = new FinalizationRegistry((t2) => {
    typeof t2 == "string" && s15.push(t2);
  });
}
var v = class {
  constructor(t2) {
    this._size = 0;
    this._options = t2, this._leakageMon = po > 0 || this._options?.leakWarningThreshold ? new Vn(t2?.onListenerError ?? Lt, this._options?.leakWarningThreshold ?? po) : void 0, this._perfMon = this._options?._profName ? new $n(this._options._profName) : void 0, this._deliveryQueue = this._options?.deliveryQueue;
  }
  dispose() {
    if (!this._disposed) {
      if (this._disposed = true, this._deliveryQueue?.current === this && this._deliveryQueue.reset(), this._listeners) {
        if (fo) {
          let t2 = this._listeners;
          queueMicrotask(() => {
            Yl(t2, (e) => e.stack?.print());
          });
        }
        this._listeners = void 0, this._size = 0;
      }
      this._options?.onDidRemoveLastListener?.(), this._leakageMon?.dispose();
    }
  }
  get event() {
    return this._event ??= (t2, e, i) => {
      if (this._leakageMon && this._size > this._leakageMon.threshold ** 2) {
        let a = `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`;
        console.warn(a);
        let u = this._leakageMon.getMostFrequentStack() ?? ["UNKNOWN stack", -1], h2 = new Yn(`${a}. HINT: Stack shows most frequent listener (${u[1]}-times)`, u[0]);
        return (this._options?.onListenerError || Lt)(h2), D.None;
      }
      if (this._disposed) return D.None;
      e && (t2 = t2.bind(e));
      let r = new Pt(t2), n, o2;
      this._leakageMon && this._size >= Math.ceil(this._leakageMon.threshold * 0.2) && (r.stack = gi.create(), n = this._leakageMon.check(r.stack, this._size + 1)), fo && (r.stack = o2 ?? gi.create()), this._listeners ? this._listeners instanceof Pt ? (this._deliveryQueue ??= new jn(), this._listeners = [this._listeners, r]) : this._listeners.push(r) : (this._options?.onWillAddFirstListener?.(this), this._listeners = r, this._options?.onDidAddFirstListener?.(this)), this._size++;
      let l = C(() => {
        _r?.unregister(l), n?.(), this._removeListener(r);
      });
      if (i instanceof Ee ? i.add(l) : Array.isArray(i) && i.push(l), _r) {
        let a = new Error().stack.split(`
`).slice(2, 3).join(`
`).trim(), u = /(file:|vscode-file:\/\/vscode-app)?(\/[^:]*:\d+:\d+)/.exec(a);
        _r.register(l, u?.[2] ?? a, l);
      }
      return l;
    }, this._event;
  }
  _removeListener(t2) {
    if (this._options?.onWillRemoveListener?.(this), !this._listeners) return;
    if (this._size === 1) {
      this._listeners = void 0, this._options?.onDidRemoveLastListener?.(this), this._size = 0;
      return;
    }
    let e = this._listeners, i = e.indexOf(t2);
    if (i === -1) throw console.log("disposed?", this._disposed), console.log("size?", this._size), console.log("arr?", JSON.stringify(this._listeners)), new Error("Attempted to dispose unknown listener");
    this._size--, e[i] = void 0;
    let r = this._deliveryQueue.current === this;
    if (this._size * ql <= e.length) {
      let n = 0;
      for (let o2 = 0; o2 < e.length; o2++) e[o2] ? e[n++] = e[o2] : r && (this._deliveryQueue.end--, n < this._deliveryQueue.i && this._deliveryQueue.i--);
      e.length = n;
    }
  }
  _deliver(t2, e) {
    if (!t2) return;
    let i = this._options?.onListenerError || Lt;
    if (!i) {
      t2.value(e);
      return;
    }
    try {
      t2.value(e);
    } catch (r) {
      i(r);
    }
  }
  _deliverQueue(t2) {
    let e = t2.current._listeners;
    for (; t2.i < t2.end; ) this._deliver(e[t2.i++], t2.value);
    t2.reset();
  }
  fire(t2) {
    if (this._deliveryQueue?.current && (this._deliverQueue(this._deliveryQueue), this._perfMon?.stop()), this._perfMon?.start(this._size), this._listeners) if (this._listeners instanceof Pt) this._deliver(this._listeners, t2);
    else {
      let e = this._deliveryQueue;
      e.enqueue(this, t2, this._listeners.length), this._deliverQueue(e);
    }
    this._perfMon?.stop();
  }
  hasListeners() {
    return this._size > 0;
  }
};
var jn = class {
  constructor() {
    this.i = -1;
    this.end = 0;
  }
  enqueue(t2, e, i) {
    this.i = 0, this.end = i, this.current = t2, this.value = e;
  }
  reset() {
    this.i = this.end, this.current = void 0, this.value = void 0;
  }
};
var gr = class gr2 {
  constructor() {
    this.mapWindowIdToZoomLevel = /* @__PURE__ */ new Map();
    this._onDidChangeZoomLevel = new v();
    this.onDidChangeZoomLevel = this._onDidChangeZoomLevel.event;
    this.mapWindowIdToZoomFactor = /* @__PURE__ */ new Map();
    this._onDidChangeFullscreen = new v();
    this.onDidChangeFullscreen = this._onDidChangeFullscreen.event;
    this.mapWindowIdToFullScreen = /* @__PURE__ */ new Map();
  }
  getZoomLevel(t2) {
    return this.mapWindowIdToZoomLevel.get(this.getWindowId(t2)) ?? 0;
  }
  setZoomLevel(t2, e) {
    if (this.getZoomLevel(e) === t2) return;
    let i = this.getWindowId(e);
    this.mapWindowIdToZoomLevel.set(i, t2), this._onDidChangeZoomLevel.fire(i);
  }
  getZoomFactor(t2) {
    return this.mapWindowIdToZoomFactor.get(this.getWindowId(t2)) ?? 1;
  }
  setZoomFactor(t2, e) {
    this.mapWindowIdToZoomFactor.set(this.getWindowId(e), t2);
  }
  setFullscreen(t2, e) {
    if (this.isFullscreen(e) === t2) return;
    let i = this.getWindowId(e);
    this.mapWindowIdToFullScreen.set(i, t2), this._onDidChangeFullscreen.fire(i);
  }
  isFullscreen(t2) {
    return !!this.mapWindowIdToFullScreen.get(this.getWindowId(t2));
  }
  getWindowId(t2) {
    return t2.vscodeWindowId;
  }
};
gr.INSTANCE = new gr();
var Si = gr;
function Xl(s15, t2, e) {
  typeof t2 == "string" && (t2 = s15.matchMedia(t2)), t2.addEventListener("change", e);
}
var Eu = Si.INSTANCE.onDidChangeZoomLevel;
function mo(s15) {
  return Si.INSTANCE.getZoomFactor(s15);
}
var Tu = Si.INSTANCE.onDidChangeFullscreen;
var Ot = typeof navigator == "object" ? navigator.userAgent : "";
var Ei = Ot.indexOf("Firefox") >= 0;
var Bt = Ot.indexOf("AppleWebKit") >= 0;
var Ti = Ot.indexOf("Chrome") >= 0;
var Sr = !Ti && Ot.indexOf("Safari") >= 0;
var Iu = Ot.indexOf("Electron/") >= 0;
var yu = Ot.indexOf("Android") >= 0;
var vr = false;
if (typeof fe.matchMedia == "function") {
  let s15 = fe.matchMedia("(display-mode: standalone) or (display-mode: window-controls-overlay)"), t2 = fe.matchMedia("(display-mode: fullscreen)");
  vr = s15.matches, Xl(fe, s15, ({ matches: e }) => {
    vr && t2.matches || (vr = e);
  });
}
function _o() {
  return vr;
}
var Nt = "en";
var yr = false;
var xr = false;
var Ii = false;
var Zl = false;
var vo = false;
var go = false;
var Jl = false;
var Ql = false;
var ea = false;
var ta = false;
var Tr;
var Ir = Nt;
var bo = Nt;
var ia;
var $e;
var Ve = globalThis;
var xe;
typeof Ve.vscode < "u" && typeof Ve.vscode.process < "u" ? xe = Ve.vscode.process : typeof process < "u" && typeof process?.versions?.node == "string" && (xe = process);
var So = typeof xe?.versions?.electron == "string";
var ra = So && xe?.type === "renderer";
if (typeof xe == "object") {
  yr = xe.platform === "win32", xr = xe.platform === "darwin", Ii = xe.platform === "linux", Zl = Ii && !!xe.env.SNAP && !!xe.env.SNAP_REVISION, Jl = So, ea = !!xe.env.CI || !!xe.env.BUILD_ARTIFACTSTAGINGDIRECTORY, Tr = Nt, Ir = Nt;
  let s15 = xe.env.VSCODE_NLS_CONFIG;
  if (s15) try {
    let t2 = JSON.parse(s15);
    Tr = t2.userLocale, bo = t2.osLocale, Ir = t2.resolvedLanguage || Nt, ia = t2.languagePack?.translationsConfigFile;
  } catch {
  }
  vo = true;
} else typeof navigator == "object" && !ra ? ($e = navigator.userAgent, yr = $e.indexOf("Windows") >= 0, xr = $e.indexOf("Macintosh") >= 0, Ql = ($e.indexOf("Macintosh") >= 0 || $e.indexOf("iPad") >= 0 || $e.indexOf("iPhone") >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0, Ii = $e.indexOf("Linux") >= 0, ta = $e?.indexOf("Mobi") >= 0, go = true, Ir = globalThis._VSCODE_NLS_LANGUAGE || Nt, Tr = navigator.language.toLowerCase(), bo = Tr) : console.error("Unable to resolve platform.");
var Xn = 0;
xr ? Xn = 1 : yr ? Xn = 3 : Ii && (Xn = 2);
var wr = yr;
var Te = xr;
var Zn = Ii;
var Dr = vo;
var na = go && typeof Ve.importScripts == "function";
var xu = na ? Ve.origin : void 0;
var Fe = $e;
var st = Ir;
var sa;
((i) => {
  function s15() {
    return st;
  }
  i.value = s15;
  function t2() {
    return st.length === 2 ? st === "en" : st.length >= 3 ? st[0] === "e" && st[1] === "n" && st[2] === "-" : false;
  }
  i.isDefaultVariant = t2;
  function e() {
    return st === "en";
  }
  i.isDefault = e;
})(sa ||= {});
var oa = typeof Ve.postMessage == "function" && !Ve.importScripts;
var Eo = (() => {
  if (oa) {
    let s15 = [];
    Ve.addEventListener("message", (e) => {
      if (e.data && e.data.vscodeScheduleAsyncWork) for (let i = 0, r = s15.length; i < r; i++) {
        let n = s15[i];
        if (n.id === e.data.vscodeScheduleAsyncWork) {
          s15.splice(i, 1), n.callback();
          return;
        }
      }
    });
    let t2 = 0;
    return (e) => {
      let i = ++t2;
      s15.push({ id: i, callback: e }), Ve.postMessage({ vscodeScheduleAsyncWork: i }, "*");
    };
  }
  return (s15) => setTimeout(s15);
})();
var la = !!(Fe && Fe.indexOf("Chrome") >= 0);
var wu = !!(Fe && Fe.indexOf("Firefox") >= 0);
var Du = !!(!la && Fe && Fe.indexOf("Safari") >= 0);
var Ru = !!(Fe && Fe.indexOf("Edg/") >= 0);
var Lu = !!(Fe && Fe.indexOf("Android") >= 0);
var ot = typeof navigator == "object" ? navigator : {};
var aa = { clipboard: { writeText: Dr || document.queryCommandSupported && document.queryCommandSupported("copy") || !!(ot && ot.clipboard && ot.clipboard.writeText), readText: Dr || !!(ot && ot.clipboard && ot.clipboard.readText) }, keyboard: Dr || _o() ? 0 : ot.keyboard || Sr ? 1 : 2, touch: "ontouchstart" in fe || ot.maxTouchPoints > 0, pointerEvents: fe.PointerEvent && ("ontouchstart" in fe || navigator.maxTouchPoints > 0) };
var yi = class {
  constructor() {
    this._keyCodeToStr = [], this._strToKeyCode = /* @__PURE__ */ Object.create(null);
  }
  define(t2, e) {
    this._keyCodeToStr[t2] = e, this._strToKeyCode[e.toLowerCase()] = t2;
  }
  keyCodeToStr(t2) {
    return this._keyCodeToStr[t2];
  }
  strToKeyCode(t2) {
    return this._strToKeyCode[t2.toLowerCase()] || 0;
  }
};
var Jn = new yi();
var To = new yi();
var Io = new yi();
var yo = new Array(230);
var Qn;
((o2) => {
  function s15(l) {
    return Jn.keyCodeToStr(l);
  }
  o2.toString = s15;
  function t2(l) {
    return Jn.strToKeyCode(l);
  }
  o2.fromString = t2;
  function e(l) {
    return To.keyCodeToStr(l);
  }
  o2.toUserSettingsUS = e;
  function i(l) {
    return Io.keyCodeToStr(l);
  }
  o2.toUserSettingsGeneral = i;
  function r(l) {
    return To.strToKeyCode(l) || Io.strToKeyCode(l);
  }
  o2.fromUserSettings = r;
  function n(l) {
    if (l >= 98 && l <= 113) return null;
    switch (l) {
      case 16:
        return "Up";
      case 18:
        return "Down";
      case 15:
        return "Left";
      case 17:
        return "Right";
    }
    return Jn.keyCodeToStr(l);
  }
  o2.toElectronAccelerator = n;
})(Qn ||= {});
var Rr = class s8 {
  constructor(t2, e, i, r, n) {
    this.ctrlKey = t2;
    this.shiftKey = e;
    this.altKey = i;
    this.metaKey = r;
    this.keyCode = n;
  }
  equals(t2) {
    return t2 instanceof s8 && this.ctrlKey === t2.ctrlKey && this.shiftKey === t2.shiftKey && this.altKey === t2.altKey && this.metaKey === t2.metaKey && this.keyCode === t2.keyCode;
  }
  getHashCode() {
    let t2 = this.ctrlKey ? "1" : "0", e = this.shiftKey ? "1" : "0", i = this.altKey ? "1" : "0", r = this.metaKey ? "1" : "0";
    return `K${t2}${e}${i}${r}${this.keyCode}`;
  }
  isModifierKey() {
    return this.keyCode === 0 || this.keyCode === 5 || this.keyCode === 57 || this.keyCode === 6 || this.keyCode === 4;
  }
  toKeybinding() {
    return new es([this]);
  }
  isDuplicateModifierCase() {
    return this.ctrlKey && this.keyCode === 5 || this.shiftKey && this.keyCode === 4 || this.altKey && this.keyCode === 6 || this.metaKey && this.keyCode === 57;
  }
};
var es = class {
  constructor(t2) {
    if (t2.length === 0) throw eo("chords");
    this.chords = t2;
  }
  getHashCode() {
    let t2 = "";
    for (let e = 0, i = this.chords.length; e < i; e++) e !== 0 && (t2 += ";"), t2 += this.chords[e].getHashCode();
    return t2;
  }
  equals(t2) {
    if (t2 === null || this.chords.length !== t2.chords.length) return false;
    for (let e = 0; e < this.chords.length; e++) if (!this.chords[e].equals(t2.chords[e])) return false;
    return true;
  }
};
function ca(s15) {
  if (s15.charCode) {
    let e = String.fromCharCode(s15.charCode).toUpperCase();
    return Qn.fromString(e);
  }
  let t2 = s15.keyCode;
  if (t2 === 3) return 7;
  if (Ei) switch (t2) {
    case 59:
      return 85;
    case 60:
      if (Zn) return 97;
      break;
    case 61:
      return 86;
    case 107:
      return 109;
    case 109:
      return 111;
    case 173:
      return 88;
    case 224:
      if (Te) return 57;
      break;
  }
  else if (Bt) {
    if (Te && t2 === 93) return 57;
    if (!Te && t2 === 92) return 57;
  }
  return yo[t2] || 0;
}
var ua = Te ? 256 : 2048;
var ha = 512;
var da = 1024;
var fa = Te ? 2048 : 256;
var ft = class {
  constructor(t2) {
    this._standardKeyboardEventBrand = true;
    let e = t2;
    this.browserEvent = e, this.target = e.target, this.ctrlKey = e.ctrlKey, this.shiftKey = e.shiftKey, this.altKey = e.altKey, this.metaKey = e.metaKey, this.altGraphKey = e.getModifierState?.("AltGraph"), this.keyCode = ca(e), this.code = e.code, this.ctrlKey = this.ctrlKey || this.keyCode === 5, this.altKey = this.altKey || this.keyCode === 6, this.shiftKey = this.shiftKey || this.keyCode === 4, this.metaKey = this.metaKey || this.keyCode === 57, this._asKeybinding = this._computeKeybinding(), this._asKeyCodeChord = this._computeKeyCodeChord();
  }
  preventDefault() {
    this.browserEvent && this.browserEvent.preventDefault && this.browserEvent.preventDefault();
  }
  stopPropagation() {
    this.browserEvent && this.browserEvent.stopPropagation && this.browserEvent.stopPropagation();
  }
  toKeyCodeChord() {
    return this._asKeyCodeChord;
  }
  equals(t2) {
    return this._asKeybinding === t2;
  }
  _computeKeybinding() {
    let t2 = 0;
    this.keyCode !== 5 && this.keyCode !== 4 && this.keyCode !== 6 && this.keyCode !== 57 && (t2 = this.keyCode);
    let e = 0;
    return this.ctrlKey && (e |= ua), this.altKey && (e |= ha), this.shiftKey && (e |= da), this.metaKey && (e |= fa), e |= t2, e;
  }
  _computeKeyCodeChord() {
    let t2 = 0;
    return this.keyCode !== 5 && this.keyCode !== 4 && this.keyCode !== 6 && this.keyCode !== 57 && (t2 = this.keyCode), new Rr(this.ctrlKey, this.shiftKey, this.altKey, this.metaKey, t2);
  }
};
var wo = /* @__PURE__ */ new WeakMap();
function pa(s15) {
  if (!s15.parent || s15.parent === s15) return null;
  try {
    let t2 = s15.location, e = s15.parent.location;
    if (t2.origin !== "null" && e.origin !== "null" && t2.origin !== e.origin) return null;
  } catch {
    return null;
  }
  return s15.parent;
}
var Lr = class {
  static getSameOriginWindowChain(t2) {
    let e = wo.get(t2);
    if (!e) {
      e = [], wo.set(t2, e);
      let i = t2, r;
      do
        r = pa(i), r ? e.push({ window: new WeakRef(i), iframeElement: i.frameElement || null }) : e.push({ window: new WeakRef(i), iframeElement: null }), i = r;
      while (i);
    }
    return e.slice(0);
  }
  static getPositionOfChildWindowRelativeToAncestorWindow(t2, e) {
    if (!e || t2 === e) return { top: 0, left: 0 };
    let i = 0, r = 0, n = this.getSameOriginWindowChain(t2);
    for (let o2 of n) {
      let l = o2.window.deref();
      if (i += l?.scrollY ?? 0, r += l?.scrollX ?? 0, l === e || !o2.iframeElement) break;
      let a = o2.iframeElement.getBoundingClientRect();
      i += a.top, r += a.left;
    }
    return { top: i, left: r };
  }
};
var qe = class {
  constructor(t2, e) {
    this.timestamp = Date.now(), this.browserEvent = e, this.leftButton = e.button === 0, this.middleButton = e.button === 1, this.rightButton = e.button === 2, this.buttons = e.buttons, this.target = e.target, this.detail = e.detail || 1, e.type === "dblclick" && (this.detail = 2), this.ctrlKey = e.ctrlKey, this.shiftKey = e.shiftKey, this.altKey = e.altKey, this.metaKey = e.metaKey, typeof e.pageX == "number" ? (this.posx = e.pageX, this.posy = e.pageY) : (this.posx = e.clientX + this.target.ownerDocument.body.scrollLeft + this.target.ownerDocument.documentElement.scrollLeft, this.posy = e.clientY + this.target.ownerDocument.body.scrollTop + this.target.ownerDocument.documentElement.scrollTop);
    let i = Lr.getPositionOfChildWindowRelativeToAncestorWindow(t2, e.view);
    this.posx -= i.left, this.posy -= i.top;
  }
  preventDefault() {
    this.browserEvent.preventDefault();
  }
  stopPropagation() {
    this.browserEvent.stopPropagation();
  }
};
var xi = class {
  constructor(t2, e = 0, i = 0) {
    this.browserEvent = t2 || null, this.target = t2 ? t2.target || t2.targetNode || t2.srcElement : null, this.deltaY = i, this.deltaX = e;
    let r = false;
    if (Ti) {
      let n = navigator.userAgent.match(/Chrome\/(\d+)/);
      r = (n ? parseInt(n[1]) : 123) <= 122;
    }
    if (t2) {
      let n = t2, o2 = t2, l = t2.view?.devicePixelRatio || 1;
      if (typeof n.wheelDeltaY < "u") r ? this.deltaY = n.wheelDeltaY / (120 * l) : this.deltaY = n.wheelDeltaY / 120;
      else if (typeof o2.VERTICAL_AXIS < "u" && o2.axis === o2.VERTICAL_AXIS) this.deltaY = -o2.detail / 3;
      else if (t2.type === "wheel") {
        let a = t2;
        a.deltaMode === a.DOM_DELTA_LINE ? Ei && !Te ? this.deltaY = -t2.deltaY / 3 : this.deltaY = -t2.deltaY : this.deltaY = -t2.deltaY / 40;
      }
      if (typeof n.wheelDeltaX < "u") Sr && wr ? this.deltaX = -(n.wheelDeltaX / 120) : r ? this.deltaX = n.wheelDeltaX / (120 * l) : this.deltaX = n.wheelDeltaX / 120;
      else if (typeof o2.HORIZONTAL_AXIS < "u" && o2.axis === o2.HORIZONTAL_AXIS) this.deltaX = -t2.detail / 3;
      else if (t2.type === "wheel") {
        let a = t2;
        a.deltaMode === a.DOM_DELTA_LINE ? Ei && !Te ? this.deltaX = -t2.deltaX / 3 : this.deltaX = -t2.deltaX : this.deltaX = -t2.deltaX / 40;
      }
      this.deltaY === 0 && this.deltaX === 0 && t2.wheelDelta && (r ? this.deltaY = t2.wheelDelta / (120 * l) : this.deltaY = t2.wheelDelta / 120);
    }
  }
  preventDefault() {
    this.browserEvent?.preventDefault();
  }
  stopPropagation() {
    this.browserEvent?.stopPropagation();
  }
};
var Do = Object.freeze(function(s15, t2) {
  let e = setTimeout(s15.bind(t2), 0);
  return { dispose() {
    clearTimeout(e);
  } };
});
var ma;
((i) => {
  function s15(r) {
    return r === i.None || r === i.Cancelled || r instanceof ts ? true : !r || typeof r != "object" ? false : typeof r.isCancellationRequested == "boolean" && typeof r.onCancellationRequested == "function";
  }
  i.isCancellationToken = s15, i.None = Object.freeze({ isCancellationRequested: false, onCancellationRequested: $.None }), i.Cancelled = Object.freeze({ isCancellationRequested: true, onCancellationRequested: Do });
})(ma ||= {});
var ts = class {
  constructor() {
    this._isCancelled = false;
    this._emitter = null;
  }
  cancel() {
    this._isCancelled || (this._isCancelled = true, this._emitter && (this._emitter.fire(void 0), this.dispose()));
  }
  get isCancellationRequested() {
    return this._isCancelled;
  }
  get onCancellationRequested() {
    return this._isCancelled ? Do : (this._emitter || (this._emitter = new v()), this._emitter.event);
  }
  dispose() {
    this._emitter && (this._emitter.dispose(), this._emitter = null);
  }
};
var Ye = class {
  constructor(t2, e) {
    this._isDisposed = false;
    this._token = -1, typeof t2 == "function" && typeof e == "number" && this.setIfNotSet(t2, e);
  }
  dispose() {
    this.cancel(), this._isDisposed = true;
  }
  cancel() {
    this._token !== -1 && (clearTimeout(this._token), this._token = -1);
  }
  cancelAndSet(t2, e) {
    if (this._isDisposed) throw new Rt("Calling 'cancelAndSet' on a disposed TimeoutTimer");
    this.cancel(), this._token = setTimeout(() => {
      this._token = -1, t2();
    }, e);
  }
  setIfNotSet(t2, e) {
    if (this._isDisposed) throw new Rt("Calling 'setIfNotSet' on a disposed TimeoutTimer");
    this._token === -1 && (this._token = setTimeout(() => {
      this._token = -1, t2();
    }, e));
  }
};
var kr = class {
  constructor() {
    this.disposable = void 0;
    this.isDisposed = false;
  }
  cancel() {
    this.disposable?.dispose(), this.disposable = void 0;
  }
  cancelAndSet(t2, e, i = globalThis) {
    if (this.isDisposed) throw new Rt("Calling 'cancelAndSet' on a disposed IntervalTimer");
    this.cancel();
    let r = i.setInterval(() => {
      t2();
    }, e);
    this.disposable = C(() => {
      i.clearInterval(r), this.disposable = void 0;
    });
  }
  dispose() {
    this.cancel(), this.isDisposed = true;
  }
};
var ba;
var Ar;
(function() {
  typeof globalThis.requestIdleCallback != "function" || typeof globalThis.cancelIdleCallback != "function" ? Ar = (s15, t2) => {
    Eo(() => {
      if (e) return;
      let i = Date.now() + 15;
      t2(Object.freeze({ didTimeout: true, timeRemaining() {
        return Math.max(0, i - Date.now());
      } }));
    });
    let e = false;
    return { dispose() {
      e || (e = true);
    } };
  } : Ar = (s15, t2, e) => {
    let i = s15.requestIdleCallback(t2, typeof e == "number" ? { timeout: e } : void 0), r = false;
    return { dispose() {
      r || (r = true, s15.cancelIdleCallback(i));
    } };
  }, ba = (s15) => Ar(globalThis, s15);
})();
var va;
((e) => {
  async function s15(i) {
    let r, n = await Promise.all(i.map((o2) => o2.then((l) => l, (l) => {
      r || (r = l);
    })));
    if (typeof r < "u") throw r;
    return n;
  }
  e.settled = s15;
  function t2(i) {
    return new Promise(async (r, n) => {
      try {
        await i(r, n);
      } catch (o2) {
        n(o2);
      }
    });
  }
  e.withAsyncBody = t2;
})(va ||= {});
var _e = class _e2 {
  static fromArray(t2) {
    return new _e2((e) => {
      e.emitMany(t2);
    });
  }
  static fromPromise(t2) {
    return new _e2(async (e) => {
      e.emitMany(await t2);
    });
  }
  static fromPromises(t2) {
    return new _e2(async (e) => {
      await Promise.all(t2.map(async (i) => e.emitOne(await i)));
    });
  }
  static merge(t2) {
    return new _e2(async (e) => {
      await Promise.all(t2.map(async (i) => {
        for await (let r of i) e.emitOne(r);
      }));
    });
  }
  constructor(t2, e) {
    this._state = 0, this._results = [], this._error = null, this._onReturn = e, this._onStateChanged = new v(), queueMicrotask(async () => {
      let i = { emitOne: (r) => this.emitOne(r), emitMany: (r) => this.emitMany(r), reject: (r) => this.reject(r) };
      try {
        await Promise.resolve(t2(i)), this.resolve();
      } catch (r) {
        this.reject(r);
      } finally {
        i.emitOne = void 0, i.emitMany = void 0, i.reject = void 0;
      }
    });
  }
  [Symbol.asyncIterator]() {
    let t2 = 0;
    return { next: async () => {
      do {
        if (this._state === 2) throw this._error;
        if (t2 < this._results.length) return { done: false, value: this._results[t2++] };
        if (this._state === 1) return { done: true, value: void 0 };
        await $.toPromise(this._onStateChanged.event);
      } while (true);
    }, return: async () => (this._onReturn?.(), { done: true, value: void 0 }) };
  }
  static map(t2, e) {
    return new _e2(async (i) => {
      for await (let r of t2) i.emitOne(e(r));
    });
  }
  map(t2) {
    return _e2.map(this, t2);
  }
  static filter(t2, e) {
    return new _e2(async (i) => {
      for await (let r of t2) e(r) && i.emitOne(r);
    });
  }
  filter(t2) {
    return _e2.filter(this, t2);
  }
  static coalesce(t2) {
    return _e2.filter(t2, (e) => !!e);
  }
  coalesce() {
    return _e2.coalesce(this);
  }
  static async toPromise(t2) {
    let e = [];
    for await (let i of t2) e.push(i);
    return e;
  }
  toPromise() {
    return _e2.toPromise(this);
  }
  emitOne(t2) {
    this._state === 0 && (this._results.push(t2), this._onStateChanged.fire());
  }
  emitMany(t2) {
    this._state === 0 && (this._results = this._results.concat(t2), this._onStateChanged.fire());
  }
  resolve() {
    this._state === 0 && (this._state = 1, this._onStateChanged.fire());
  }
  reject(t2) {
    this._state === 0 && (this._state = 2, this._error = t2, this._onStateChanged.fire());
  }
};
_e.EMPTY = _e.fromArray([]);
function Lo(s15) {
  return 55296 <= s15 && s15 <= 56319;
}
function is(s15) {
  return 56320 <= s15 && s15 <= 57343;
}
function Ao(s15, t2) {
  return (s15 - 55296 << 10) + (t2 - 56320) + 65536;
}
function Mo(s15) {
  return ns(s15, 0);
}
function ns(s15, t2) {
  switch (typeof s15) {
    case "object":
      return s15 === null ? je(349, t2) : Array.isArray(s15) ? Ea(s15, t2) : Ta(s15, t2);
    case "string":
      return Po(s15, t2);
    case "boolean":
      return Sa(s15, t2);
    case "number":
      return je(s15, t2);
    case "undefined":
      return je(937, t2);
    default:
      return je(617, t2);
  }
}
function je(s15, t2) {
  return (t2 << 5) - t2 + s15 | 0;
}
function Sa(s15, t2) {
  return je(s15 ? 433 : 863, t2);
}
function Po(s15, t2) {
  t2 = je(149417, t2);
  for (let e = 0, i = s15.length; e < i; e++) t2 = je(s15.charCodeAt(e), t2);
  return t2;
}
function Ea(s15, t2) {
  return t2 = je(104579, t2), s15.reduce((e, i) => ns(i, e), t2);
}
function Ta(s15, t2) {
  return t2 = je(181387, t2), Object.keys(s15).sort().reduce((e, i) => (e = Po(i, e), ns(s15[i], e)), t2);
}
function rs(s15, t2, e = 32) {
  let i = e - t2, r = ~((1 << i) - 1);
  return (s15 << t2 | (r & s15) >>> i) >>> 0;
}
function ko(s15, t2 = 0, e = s15.byteLength, i = 0) {
  for (let r = 0; r < e; r++) s15[t2 + r] = i;
}
function Ia(s15, t2, e = "0") {
  for (; s15.length < t2; ) s15 = e + s15;
  return s15;
}
function wi(s15, t2 = 32) {
  return s15 instanceof ArrayBuffer ? Array.from(new Uint8Array(s15)).map((e) => e.toString(16).padStart(2, "0")).join("") : Ia((s15 >>> 0).toString(16), t2 / 4);
}
var Cr = class Cr2 {
  constructor() {
    this._h0 = 1732584193;
    this._h1 = 4023233417;
    this._h2 = 2562383102;
    this._h3 = 271733878;
    this._h4 = 3285377520;
    this._buff = new Uint8Array(67), this._buffDV = new DataView(this._buff.buffer), this._buffLen = 0, this._totalLen = 0, this._leftoverHighSurrogate = 0, this._finished = false;
  }
  update(t2) {
    let e = t2.length;
    if (e === 0) return;
    let i = this._buff, r = this._buffLen, n = this._leftoverHighSurrogate, o2, l;
    for (n !== 0 ? (o2 = n, l = -1, n = 0) : (o2 = t2.charCodeAt(0), l = 0); ; ) {
      let a = o2;
      if (Lo(o2)) if (l + 1 < e) {
        let u = t2.charCodeAt(l + 1);
        is(u) ? (l++, a = Ao(o2, u)) : a = 65533;
      } else {
        n = o2;
        break;
      }
      else is(o2) && (a = 65533);
      if (r = this._push(i, r, a), l++, l < e) o2 = t2.charCodeAt(l);
      else break;
    }
    this._buffLen = r, this._leftoverHighSurrogate = n;
  }
  _push(t2, e, i) {
    return i < 128 ? t2[e++] = i : i < 2048 ? (t2[e++] = 192 | (i & 1984) >>> 6, t2[e++] = 128 | (i & 63) >>> 0) : i < 65536 ? (t2[e++] = 224 | (i & 61440) >>> 12, t2[e++] = 128 | (i & 4032) >>> 6, t2[e++] = 128 | (i & 63) >>> 0) : (t2[e++] = 240 | (i & 1835008) >>> 18, t2[e++] = 128 | (i & 258048) >>> 12, t2[e++] = 128 | (i & 4032) >>> 6, t2[e++] = 128 | (i & 63) >>> 0), e >= 64 && (this._step(), e -= 64, this._totalLen += 64, t2[0] = t2[64], t2[1] = t2[65], t2[2] = t2[66]), e;
  }
  digest() {
    return this._finished || (this._finished = true, this._leftoverHighSurrogate && (this._leftoverHighSurrogate = 0, this._buffLen = this._push(this._buff, this._buffLen, 65533)), this._totalLen += this._buffLen, this._wrapUp()), wi(this._h0) + wi(this._h1) + wi(this._h2) + wi(this._h3) + wi(this._h4);
  }
  _wrapUp() {
    this._buff[this._buffLen++] = 128, ko(this._buff, this._buffLen), this._buffLen > 56 && (this._step(), ko(this._buff));
    let t2 = 8 * this._totalLen;
    this._buffDV.setUint32(56, Math.floor(t2 / 4294967296), false), this._buffDV.setUint32(60, t2 % 4294967296, false), this._step();
  }
  _step() {
    let t2 = Cr2._bigBlock32, e = this._buffDV;
    for (let c = 0; c < 64; c += 4) t2.setUint32(c, e.getUint32(c, false), false);
    for (let c = 64; c < 320; c += 4) t2.setUint32(c, rs(t2.getUint32(c - 12, false) ^ t2.getUint32(c - 32, false) ^ t2.getUint32(c - 56, false) ^ t2.getUint32(c - 64, false), 1), false);
    let i = this._h0, r = this._h1, n = this._h2, o2 = this._h3, l = this._h4, a, u, h2;
    for (let c = 0; c < 80; c++) c < 20 ? (a = r & n | ~r & o2, u = 1518500249) : c < 40 ? (a = r ^ n ^ o2, u = 1859775393) : c < 60 ? (a = r & n | r & o2 | n & o2, u = 2400959708) : (a = r ^ n ^ o2, u = 3395469782), h2 = rs(i, 5) + a + l + u + t2.getUint32(c * 4, false) & 4294967295, l = o2, o2 = n, n = rs(r, 30), r = i, i = h2;
    this._h0 = this._h0 + i & 4294967295, this._h1 = this._h1 + r & 4294967295, this._h2 = this._h2 + n & 4294967295, this._h3 = this._h3 + o2 & 4294967295, this._h4 = this._h4 + l & 4294967295;
  }
};
Cr._bigBlock32 = new DataView(new ArrayBuffer(320));
var { registerWindow: Bh, getWindow: be, getDocument: Nh, getWindows: Fh, getWindowsCount: Hh, getWindowId: Oo, getWindowById: Wh, hasWindow: Uh, onDidRegisterWindow: No, onWillUnregisterWindow: Kh, onDidUnregisterWindow: zh2 } = (function() {
  let s15 = /* @__PURE__ */ new Map();
  fe;
  let t2 = { window: fe, disposables: new Ee() };
  s15.set(fe.vscodeWindowId, t2);
  let e = new v(), i = new v(), r = new v();
  function n(o2, l) {
    return (typeof o2 == "number" ? s15.get(o2) : void 0) ?? (l ? t2 : void 0);
  }
  return { onDidRegisterWindow: e.event, onWillUnregisterWindow: r.event, onDidUnregisterWindow: i.event, registerWindow(o2) {
    if (s15.has(o2.vscodeWindowId)) return D.None;
    let l = new Ee(), a = { window: o2, disposables: l.add(new Ee()) };
    return s15.set(o2.vscodeWindowId, a), l.add(C(() => {
      s15.delete(o2.vscodeWindowId), i.fire(o2);
    })), l.add(L(o2, Y.BEFORE_UNLOAD, () => {
      r.fire(o2);
    })), e.fire(a), l;
  }, getWindows() {
    return s15.values();
  }, getWindowsCount() {
    return s15.size;
  }, getWindowId(o2) {
    return o2.vscodeWindowId;
  }, hasWindow(o2) {
    return s15.has(o2);
  }, getWindowById: n, getWindow(o2) {
    let l = o2;
    if (l?.ownerDocument?.defaultView) return l.ownerDocument.defaultView.window;
    let a = o2;
    return a?.view ? a.view.window : fe;
  }, getDocument(o2) {
    return be(o2).document;
  } };
})();
var ss = class {
  constructor(t2, e, i, r) {
    this._node = t2, this._type = e, this._handler = i, this._options = r || false, this._node.addEventListener(this._type, this._handler, this._options);
  }
  dispose() {
    this._handler && (this._node.removeEventListener(this._type, this._handler, this._options), this._node = null, this._handler = null);
  }
};
function L(s15, t2, e, i) {
  return new ss(s15, t2, e, i);
}
function ya(s15, t2) {
  return function(e) {
    return t2(new qe(s15, e));
  };
}
function xa(s15) {
  return function(t2) {
    return s15(new ft(t2));
  };
}
var os = function(t2, e, i, r) {
  let n = i;
  return e === "click" || e === "mousedown" || e === "contextmenu" ? n = ya(be(t2), i) : (e === "keydown" || e === "keypress" || e === "keyup") && (n = xa(i)), L(t2, e, n, r);
};
var wa;
var mt;
var Mr = class extends kr {
  constructor(t2) {
    super(), this.defaultTarget = t2 && be(t2);
  }
  cancelAndSet(t2, e, i) {
    return super.cancelAndSet(t2, e, i ?? this.defaultTarget);
  }
};
var Di = class {
  constructor(t2, e = 0) {
    this._runner = t2, this.priority = e, this._canceled = false;
  }
  dispose() {
    this._canceled = true;
  }
  execute() {
    if (!this._canceled) try {
      this._runner();
    } catch (t2) {
      Lt(t2);
    }
  }
  static sort(t2, e) {
    return e.priority - t2.priority;
  }
};
(function() {
  let s15 = /* @__PURE__ */ new Map(), t2 = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = (n) => {
    e.set(n, false);
    let o2 = s15.get(n) ?? [];
    for (t2.set(n, o2), s15.set(n, []), i.set(n, true); o2.length > 0; ) o2.sort(Di.sort), o2.shift().execute();
    i.set(n, false);
  };
  mt = (n, o2, l = 0) => {
    let a = Oo(n), u = new Di(o2, l), h2 = s15.get(a);
    return h2 || (h2 = [], s15.set(a, h2)), h2.push(u), e.get(a) || (e.set(a, true), n.requestAnimationFrame(() => r(a))), u;
  }, wa = (n, o2, l) => {
    let a = Oo(n);
    if (i.get(a)) {
      let u = new Di(o2, l), h2 = t2.get(a);
      return h2 || (h2 = [], t2.set(a, h2)), h2.push(u), u;
    } else return mt(n, o2, l);
  };
})();
var pt = class pt2 {
  constructor(t2, e) {
    this.width = t2;
    this.height = e;
  }
  with(t2 = this.width, e = this.height) {
    return t2 !== this.width || e !== this.height ? new pt2(t2, e) : this;
  }
  static is(t2) {
    return typeof t2 == "object" && typeof t2.height == "number" && typeof t2.width == "number";
  }
  static lift(t2) {
    return t2 instanceof pt2 ? t2 : new pt2(t2.width, t2.height);
  }
  static equals(t2, e) {
    return t2 === e ? true : !t2 || !e ? false : t2.width === e.width && t2.height === e.height;
  }
};
pt.None = new pt(0, 0);
function Fo(s15) {
  let t2 = s15.getBoundingClientRect(), e = be(s15);
  return { left: t2.left + e.scrollX, top: t2.top + e.scrollY, width: t2.width, height: t2.height };
}
var Gh = new class {
  constructor() {
    this.mutationObservers = /* @__PURE__ */ new Map();
  }
  observe(s15, t2, e) {
    let i = this.mutationObservers.get(s15);
    i || (i = /* @__PURE__ */ new Map(), this.mutationObservers.set(s15, i));
    let r = Mo(e), n = i.get(r);
    if (n) n.users += 1;
    else {
      let o2 = new v(), l = new MutationObserver((u) => o2.fire(u));
      l.observe(s15, e);
      let a = n = { users: 1, observer: l, onDidMutate: o2.event };
      t2.add(C(() => {
        a.users -= 1, a.users === 0 && (o2.dispose(), l.disconnect(), i?.delete(r), i?.size === 0 && this.mutationObservers.delete(s15));
      })), i.set(r, n);
    }
    return n.onDidMutate;
  }
}();
var Y = { CLICK: "click", AUXCLICK: "auxclick", DBLCLICK: "dblclick", MOUSE_UP: "mouseup", MOUSE_DOWN: "mousedown", MOUSE_OVER: "mouseover", MOUSE_MOVE: "mousemove", MOUSE_OUT: "mouseout", MOUSE_ENTER: "mouseenter", MOUSE_LEAVE: "mouseleave", MOUSE_WHEEL: "wheel", POINTER_UP: "pointerup", POINTER_DOWN: "pointerdown", POINTER_MOVE: "pointermove", POINTER_LEAVE: "pointerleave", CONTEXT_MENU: "contextmenu", WHEEL: "wheel", KEY_DOWN: "keydown", KEY_PRESS: "keypress", KEY_UP: "keyup", LOAD: "load", BEFORE_UNLOAD: "beforeunload", UNLOAD: "unload", PAGE_SHOW: "pageshow", PAGE_HIDE: "pagehide", PASTE: "paste", ABORT: "abort", ERROR: "error", RESIZE: "resize", SCROLL: "scroll", FULLSCREEN_CHANGE: "fullscreenchange", WK_FULLSCREEN_CHANGE: "webkitfullscreenchange", SELECT: "select", CHANGE: "change", SUBMIT: "submit", RESET: "reset", FOCUS: "focus", FOCUS_IN: "focusin", FOCUS_OUT: "focusout", BLUR: "blur", INPUT: "input", STORAGE: "storage", DRAG_START: "dragstart", DRAG: "drag", DRAG_ENTER: "dragenter", DRAG_LEAVE: "dragleave", DRAG_OVER: "dragover", DROP: "drop", DRAG_END: "dragend", ANIMATION_START: Bt ? "webkitAnimationStart" : "animationstart", ANIMATION_END: Bt ? "webkitAnimationEnd" : "animationend", ANIMATION_ITERATION: Bt ? "webkitAnimationIteration" : "animationiteration" };
var Da = /([\w\-]+)?(#([\w\-]+))?((\.([\w\-]+))*)/;
function Ho(s15, t2, e, ...i) {
  let r = Da.exec(t2);
  if (!r) throw new Error("Bad use of emmet");
  let n = r[1] || "div", o2;
  return s15 !== "http://www.w3.org/1999/xhtml" ? o2 = document.createElementNS(s15, n) : o2 = document.createElement(n), r[3] && (o2.id = r[3]), r[4] && (o2.className = r[4].replace(/\./g, " ").trim()), e && Object.entries(e).forEach(([l, a]) => {
    typeof a > "u" || (/^on\w+$/.test(l) ? o2[l] = a : l === "selected" ? a && o2.setAttribute(l, "true") : o2.setAttribute(l, a));
  }), o2.append(...i), o2;
}
function Ra(s15, t2, ...e) {
  return Ho("http://www.w3.org/1999/xhtml", s15, t2, ...e);
}
Ra.SVG = function(s15, t2, ...e) {
  return Ho("http://www.w3.org/2000/svg", s15, t2, ...e);
};
var ls = class {
  constructor(t2) {
    this.domNode = t2;
    this._maxWidth = "";
    this._width = "";
    this._height = "";
    this._top = "";
    this._left = "";
    this._bottom = "";
    this._right = "";
    this._paddingTop = "";
    this._paddingLeft = "";
    this._paddingBottom = "";
    this._paddingRight = "";
    this._fontFamily = "";
    this._fontWeight = "";
    this._fontSize = "";
    this._fontStyle = "";
    this._fontFeatureSettings = "";
    this._fontVariationSettings = "";
    this._textDecoration = "";
    this._lineHeight = "";
    this._letterSpacing = "";
    this._className = "";
    this._display = "";
    this._position = "";
    this._visibility = "";
    this._color = "";
    this._backgroundColor = "";
    this._layerHint = false;
    this._contain = "none";
    this._boxShadow = "";
  }
  setMaxWidth(t2) {
    let e = Ie(t2);
    this._maxWidth !== e && (this._maxWidth = e, this.domNode.style.maxWidth = this._maxWidth);
  }
  setWidth(t2) {
    let e = Ie(t2);
    this._width !== e && (this._width = e, this.domNode.style.width = this._width);
  }
  setHeight(t2) {
    let e = Ie(t2);
    this._height !== e && (this._height = e, this.domNode.style.height = this._height);
  }
  setTop(t2) {
    let e = Ie(t2);
    this._top !== e && (this._top = e, this.domNode.style.top = this._top);
  }
  setLeft(t2) {
    let e = Ie(t2);
    this._left !== e && (this._left = e, this.domNode.style.left = this._left);
  }
  setBottom(t2) {
    let e = Ie(t2);
    this._bottom !== e && (this._bottom = e, this.domNode.style.bottom = this._bottom);
  }
  setRight(t2) {
    let e = Ie(t2);
    this._right !== e && (this._right = e, this.domNode.style.right = this._right);
  }
  setPaddingTop(t2) {
    let e = Ie(t2);
    this._paddingTop !== e && (this._paddingTop = e, this.domNode.style.paddingTop = this._paddingTop);
  }
  setPaddingLeft(t2) {
    let e = Ie(t2);
    this._paddingLeft !== e && (this._paddingLeft = e, this.domNode.style.paddingLeft = this._paddingLeft);
  }
  setPaddingBottom(t2) {
    let e = Ie(t2);
    this._paddingBottom !== e && (this._paddingBottom = e, this.domNode.style.paddingBottom = this._paddingBottom);
  }
  setPaddingRight(t2) {
    let e = Ie(t2);
    this._paddingRight !== e && (this._paddingRight = e, this.domNode.style.paddingRight = this._paddingRight);
  }
  setFontFamily(t2) {
    this._fontFamily !== t2 && (this._fontFamily = t2, this.domNode.style.fontFamily = this._fontFamily);
  }
  setFontWeight(t2) {
    this._fontWeight !== t2 && (this._fontWeight = t2, this.domNode.style.fontWeight = this._fontWeight);
  }
  setFontSize(t2) {
    let e = Ie(t2);
    this._fontSize !== e && (this._fontSize = e, this.domNode.style.fontSize = this._fontSize);
  }
  setFontStyle(t2) {
    this._fontStyle !== t2 && (this._fontStyle = t2, this.domNode.style.fontStyle = this._fontStyle);
  }
  setFontFeatureSettings(t2) {
    this._fontFeatureSettings !== t2 && (this._fontFeatureSettings = t2, this.domNode.style.fontFeatureSettings = this._fontFeatureSettings);
  }
  setFontVariationSettings(t2) {
    this._fontVariationSettings !== t2 && (this._fontVariationSettings = t2, this.domNode.style.fontVariationSettings = this._fontVariationSettings);
  }
  setTextDecoration(t2) {
    this._textDecoration !== t2 && (this._textDecoration = t2, this.domNode.style.textDecoration = this._textDecoration);
  }
  setLineHeight(t2) {
    let e = Ie(t2);
    this._lineHeight !== e && (this._lineHeight = e, this.domNode.style.lineHeight = this._lineHeight);
  }
  setLetterSpacing(t2) {
    let e = Ie(t2);
    this._letterSpacing !== e && (this._letterSpacing = e, this.domNode.style.letterSpacing = this._letterSpacing);
  }
  setClassName(t2) {
    this._className !== t2 && (this._className = t2, this.domNode.className = this._className);
  }
  toggleClassName(t2, e) {
    this.domNode.classList.toggle(t2, e), this._className = this.domNode.className;
  }
  setDisplay(t2) {
    this._display !== t2 && (this._display = t2, this.domNode.style.display = this._display);
  }
  setPosition(t2) {
    this._position !== t2 && (this._position = t2, this.domNode.style.position = this._position);
  }
  setVisibility(t2) {
    this._visibility !== t2 && (this._visibility = t2, this.domNode.style.visibility = this._visibility);
  }
  setColor(t2) {
    this._color !== t2 && (this._color = t2, this.domNode.style.color = this._color);
  }
  setBackgroundColor(t2) {
    this._backgroundColor !== t2 && (this._backgroundColor = t2, this.domNode.style.backgroundColor = this._backgroundColor);
  }
  setLayerHinting(t2) {
    this._layerHint !== t2 && (this._layerHint = t2, this.domNode.style.transform = this._layerHint ? "translate3d(0px, 0px, 0px)" : "");
  }
  setBoxShadow(t2) {
    this._boxShadow !== t2 && (this._boxShadow = t2, this.domNode.style.boxShadow = t2);
  }
  setContain(t2) {
    this._contain !== t2 && (this._contain = t2, this.domNode.style.contain = this._contain);
  }
  setAttribute(t2, e) {
    this.domNode.setAttribute(t2, e);
  }
  removeAttribute(t2) {
    this.domNode.removeAttribute(t2);
  }
  appendChild(t2) {
    this.domNode.appendChild(t2.domNode);
  }
  removeChild(t2) {
    this.domNode.removeChild(t2.domNode);
  }
};
function Ie(s15) {
  return typeof s15 == "number" ? `${s15}px` : s15;
}
function _t(s15) {
  return new ls(s15);
}
var Wt = class {
  constructor() {
    this._hooks = new Ee();
    this._pointerMoveCallback = null;
    this._onStopCallback = null;
  }
  dispose() {
    this.stopMonitoring(false), this._hooks.dispose();
  }
  stopMonitoring(t2, e) {
    if (!this.isMonitoring()) return;
    this._hooks.clear(), this._pointerMoveCallback = null;
    let i = this._onStopCallback;
    this._onStopCallback = null, t2 && i && i(e);
  }
  isMonitoring() {
    return !!this._pointerMoveCallback;
  }
  startMonitoring(t2, e, i, r, n) {
    this.isMonitoring() && this.stopMonitoring(false), this._pointerMoveCallback = r, this._onStopCallback = n;
    let o2 = t2;
    try {
      t2.setPointerCapture(e), this._hooks.add(C(() => {
        try {
          t2.releasePointerCapture(e);
        } catch {
        }
      }));
    } catch {
      o2 = be(t2);
    }
    this._hooks.add(L(o2, Y.POINTER_MOVE, (l) => {
      if (l.buttons !== i) {
        this.stopMonitoring(true);
        return;
      }
      l.preventDefault(), this._pointerMoveCallback(l);
    })), this._hooks.add(L(o2, Y.POINTER_UP, (l) => this.stopMonitoring(true)));
  }
};
function Wo(s15, t2, e) {
  let i = null, r = null;
  if (typeof e.value == "function" ? (i = "value", r = e.value, r.length !== 0 && console.warn("Memoize should only be used in functions with zero parameters")) : typeof e.get == "function" && (i = "get", r = e.get), !r) throw new Error("not supported");
  let n = `$memoize$${t2}`;
  e[i] = function(...o2) {
    return this.hasOwnProperty(n) || Object.defineProperty(this, n, { configurable: false, enumerable: false, writable: false, value: r.apply(this, o2) }), this[n];
  };
}
var He;
((n) => (n.Tap = "-xterm-gesturetap", n.Change = "-xterm-gesturechange", n.Start = "-xterm-gesturestart", n.End = "-xterm-gesturesend", n.Contextmenu = "-xterm-gesturecontextmenu"))(He ||= {});
var Q = class Q2 extends D {
  constructor() {
    super();
    this.dispatched = false;
    this.targets = new Ct();
    this.ignoreTargets = new Ct();
    this.activeTouches = {}, this.handle = null, this._lastSetTapCountTime = 0, this._register($.runAndSubscribe(No, ({ window: e, disposables: i }) => {
      i.add(L(e.document, "touchstart", (r) => this.onTouchStart(r), { passive: false })), i.add(L(e.document, "touchend", (r) => this.onTouchEnd(e, r))), i.add(L(e.document, "touchmove", (r) => this.onTouchMove(r), { passive: false }));
    }, { window: fe, disposables: this._store }));
  }
  static addTarget(e) {
    if (!Q2.isTouchDevice()) return D.None;
    Q2.INSTANCE || (Q2.INSTANCE = Gn(new Q2()));
    let i = Q2.INSTANCE.targets.push(e);
    return C(i);
  }
  static ignoreTarget(e) {
    if (!Q2.isTouchDevice()) return D.None;
    Q2.INSTANCE || (Q2.INSTANCE = Gn(new Q2()));
    let i = Q2.INSTANCE.ignoreTargets.push(e);
    return C(i);
  }
  static isTouchDevice() {
    return "ontouchstart" in fe || navigator.maxTouchPoints > 0;
  }
  dispose() {
    this.handle && (this.handle.dispose(), this.handle = null), super.dispose();
  }
  onTouchStart(e) {
    let i = Date.now();
    this.handle && (this.handle.dispose(), this.handle = null);
    for (let r = 0, n = e.targetTouches.length; r < n; r++) {
      let o2 = e.targetTouches.item(r);
      this.activeTouches[o2.identifier] = { id: o2.identifier, initialTarget: o2.target, initialTimeStamp: i, initialPageX: o2.pageX, initialPageY: o2.pageY, rollingTimestamps: [i], rollingPageX: [o2.pageX], rollingPageY: [o2.pageY] };
      let l = this.newGestureEvent(He.Start, o2.target);
      l.pageX = o2.pageX, l.pageY = o2.pageY, this.dispatchEvent(l);
    }
    this.dispatched && (e.preventDefault(), e.stopPropagation(), this.dispatched = false);
  }
  onTouchEnd(e, i) {
    let r = Date.now(), n = Object.keys(this.activeTouches).length;
    for (let o2 = 0, l = i.changedTouches.length; o2 < l; o2++) {
      let a = i.changedTouches.item(o2);
      if (!this.activeTouches.hasOwnProperty(String(a.identifier))) {
        console.warn("move of an UNKNOWN touch", a);
        continue;
      }
      let u = this.activeTouches[a.identifier], h2 = Date.now() - u.initialTimeStamp;
      if (h2 < Q2.HOLD_DELAY && Math.abs(u.initialPageX - Se(u.rollingPageX)) < 30 && Math.abs(u.initialPageY - Se(u.rollingPageY)) < 30) {
        let c = this.newGestureEvent(He.Tap, u.initialTarget);
        c.pageX = Se(u.rollingPageX), c.pageY = Se(u.rollingPageY), this.dispatchEvent(c);
      } else if (h2 >= Q2.HOLD_DELAY && Math.abs(u.initialPageX - Se(u.rollingPageX)) < 30 && Math.abs(u.initialPageY - Se(u.rollingPageY)) < 30) {
        let c = this.newGestureEvent(He.Contextmenu, u.initialTarget);
        c.pageX = Se(u.rollingPageX), c.pageY = Se(u.rollingPageY), this.dispatchEvent(c);
      } else if (n === 1) {
        let c = Se(u.rollingPageX), d = Se(u.rollingPageY), _2 = Se(u.rollingTimestamps) - u.rollingTimestamps[0], p = c - u.rollingPageX[0], m = d - u.rollingPageY[0], f = [...this.targets].filter((A) => u.initialTarget instanceof Node && A.contains(u.initialTarget));
        this.inertia(e, f, r, Math.abs(p) / _2, p > 0 ? 1 : -1, c, Math.abs(m) / _2, m > 0 ? 1 : -1, d);
      }
      this.dispatchEvent(this.newGestureEvent(He.End, u.initialTarget)), delete this.activeTouches[a.identifier];
    }
    this.dispatched && (i.preventDefault(), i.stopPropagation(), this.dispatched = false);
  }
  newGestureEvent(e, i) {
    let r = document.createEvent("CustomEvent");
    return r.initEvent(e, false, true), r.initialTarget = i, r.tapCount = 0, r;
  }
  dispatchEvent(e) {
    if (e.type === He.Tap) {
      let i = (/* @__PURE__ */ new Date()).getTime(), r = 0;
      i - this._lastSetTapCountTime > Q2.CLEAR_TAP_COUNT_TIME ? r = 1 : r = 2, this._lastSetTapCountTime = i, e.tapCount = r;
    } else (e.type === He.Change || e.type === He.Contextmenu) && (this._lastSetTapCountTime = 0);
    if (e.initialTarget instanceof Node) {
      for (let r of this.ignoreTargets) if (r.contains(e.initialTarget)) return;
      let i = [];
      for (let r of this.targets) if (r.contains(e.initialTarget)) {
        let n = 0, o2 = e.initialTarget;
        for (; o2 && o2 !== r; ) n++, o2 = o2.parentElement;
        i.push([n, r]);
      }
      i.sort((r, n) => r[0] - n[0]);
      for (let [r, n] of i) n.dispatchEvent(e), this.dispatched = true;
    }
  }
  inertia(e, i, r, n, o2, l, a, u, h2) {
    this.handle = mt(e, () => {
      let c = Date.now(), d = c - r, _2 = 0, p = 0, m = true;
      n += Q2.SCROLL_FRICTION * d, a += Q2.SCROLL_FRICTION * d, n > 0 && (m = false, _2 = o2 * n * d), a > 0 && (m = false, p = u * a * d);
      let f = this.newGestureEvent(He.Change);
      f.translationX = _2, f.translationY = p, i.forEach((A) => A.dispatchEvent(f)), m || this.inertia(e, i, c, n, o2, l + _2, a, u, h2 + p);
    });
  }
  onTouchMove(e) {
    let i = Date.now();
    for (let r = 0, n = e.changedTouches.length; r < n; r++) {
      let o2 = e.changedTouches.item(r);
      if (!this.activeTouches.hasOwnProperty(String(o2.identifier))) {
        console.warn("end of an UNKNOWN touch", o2);
        continue;
      }
      let l = this.activeTouches[o2.identifier], a = this.newGestureEvent(He.Change, l.initialTarget);
      a.translationX = o2.pageX - Se(l.rollingPageX), a.translationY = o2.pageY - Se(l.rollingPageY), a.pageX = o2.pageX, a.pageY = o2.pageY, this.dispatchEvent(a), l.rollingPageX.length > 3 && (l.rollingPageX.shift(), l.rollingPageY.shift(), l.rollingTimestamps.shift()), l.rollingPageX.push(o2.pageX), l.rollingPageY.push(o2.pageY), l.rollingTimestamps.push(i);
    }
    this.dispatched && (e.preventDefault(), e.stopPropagation(), this.dispatched = false);
  }
};
Q.SCROLL_FRICTION = -5e-3, Q.HOLD_DELAY = 700, Q.CLEAR_TAP_COUNT_TIME = 400, M([Wo], Q, "isTouchDevice", 1);
var Pr = Q;
var lt = class extends D {
  onclick(t2, e) {
    this._register(L(t2, Y.CLICK, (i) => e(new qe(be(t2), i))));
  }
  onmousedown(t2, e) {
    this._register(L(t2, Y.MOUSE_DOWN, (i) => e(new qe(be(t2), i))));
  }
  onmouseover(t2, e) {
    this._register(L(t2, Y.MOUSE_OVER, (i) => e(new qe(be(t2), i))));
  }
  onmouseleave(t2, e) {
    this._register(L(t2, Y.MOUSE_LEAVE, (i) => e(new qe(be(t2), i))));
  }
  onkeydown(t2, e) {
    this._register(L(t2, Y.KEY_DOWN, (i) => e(new ft(i))));
  }
  onkeyup(t2, e) {
    this._register(L(t2, Y.KEY_UP, (i) => e(new ft(i))));
  }
  oninput(t2, e) {
    this._register(L(t2, Y.INPUT, e));
  }
  onblur(t2, e) {
    this._register(L(t2, Y.BLUR, e));
  }
  onfocus(t2, e) {
    this._register(L(t2, Y.FOCUS, e));
  }
  onchange(t2, e) {
    this._register(L(t2, Y.CHANGE, e));
  }
  ignoreGesture(t2) {
    return Pr.ignoreTarget(t2);
  }
};
var Uo = 11;
var Or = class extends lt {
  constructor(t2) {
    super(), this._onActivate = t2.onActivate, this.bgDomNode = document.createElement("div"), this.bgDomNode.className = "arrow-background", this.bgDomNode.style.position = "absolute", this.bgDomNode.style.width = t2.bgWidth + "px", this.bgDomNode.style.height = t2.bgHeight + "px", typeof t2.top < "u" && (this.bgDomNode.style.top = "0px"), typeof t2.left < "u" && (this.bgDomNode.style.left = "0px"), typeof t2.bottom < "u" && (this.bgDomNode.style.bottom = "0px"), typeof t2.right < "u" && (this.bgDomNode.style.right = "0px"), this.domNode = document.createElement("div"), this.domNode.className = t2.className, this.domNode.style.position = "absolute", this.domNode.style.width = Uo + "px", this.domNode.style.height = Uo + "px", typeof t2.top < "u" && (this.domNode.style.top = t2.top + "px"), typeof t2.left < "u" && (this.domNode.style.left = t2.left + "px"), typeof t2.bottom < "u" && (this.domNode.style.bottom = t2.bottom + "px"), typeof t2.right < "u" && (this.domNode.style.right = t2.right + "px"), this._pointerMoveMonitor = this._register(new Wt()), this._register(os(this.bgDomNode, Y.POINTER_DOWN, (e) => this._arrowPointerDown(e))), this._register(os(this.domNode, Y.POINTER_DOWN, (e) => this._arrowPointerDown(e))), this._pointerdownRepeatTimer = this._register(new Mr()), this._pointerdownScheduleRepeatTimer = this._register(new Ye());
  }
  _arrowPointerDown(t2) {
    if (!t2.target || !(t2.target instanceof Element)) return;
    let e = () => {
      this._pointerdownRepeatTimer.cancelAndSet(() => this._onActivate(), 1e3 / 24, be(t2));
    };
    this._onActivate(), this._pointerdownRepeatTimer.cancel(), this._pointerdownScheduleRepeatTimer.cancelAndSet(e, 200), this._pointerMoveMonitor.startMonitoring(t2.target, t2.pointerId, t2.buttons, (i) => {
    }, () => {
      this._pointerdownRepeatTimer.cancel(), this._pointerdownScheduleRepeatTimer.cancel();
    }), t2.preventDefault();
  }
};
var cs = class s9 {
  constructor(t2, e, i, r, n, o2, l) {
    this._forceIntegerValues = t2;
    this._scrollStateBrand = void 0;
    this._forceIntegerValues && (e = e | 0, i = i | 0, r = r | 0, n = n | 0, o2 = o2 | 0, l = l | 0), this.rawScrollLeft = r, this.rawScrollTop = l, e < 0 && (e = 0), r + e > i && (r = i - e), r < 0 && (r = 0), n < 0 && (n = 0), l + n > o2 && (l = o2 - n), l < 0 && (l = 0), this.width = e, this.scrollWidth = i, this.scrollLeft = r, this.height = n, this.scrollHeight = o2, this.scrollTop = l;
  }
  equals(t2) {
    return this.rawScrollLeft === t2.rawScrollLeft && this.rawScrollTop === t2.rawScrollTop && this.width === t2.width && this.scrollWidth === t2.scrollWidth && this.scrollLeft === t2.scrollLeft && this.height === t2.height && this.scrollHeight === t2.scrollHeight && this.scrollTop === t2.scrollTop;
  }
  withScrollDimensions(t2, e) {
    return new s9(this._forceIntegerValues, typeof t2.width < "u" ? t2.width : this.width, typeof t2.scrollWidth < "u" ? t2.scrollWidth : this.scrollWidth, e ? this.rawScrollLeft : this.scrollLeft, typeof t2.height < "u" ? t2.height : this.height, typeof t2.scrollHeight < "u" ? t2.scrollHeight : this.scrollHeight, e ? this.rawScrollTop : this.scrollTop);
  }
  withScrollPosition(t2) {
    return new s9(this._forceIntegerValues, this.width, this.scrollWidth, typeof t2.scrollLeft < "u" ? t2.scrollLeft : this.rawScrollLeft, this.height, this.scrollHeight, typeof t2.scrollTop < "u" ? t2.scrollTop : this.rawScrollTop);
  }
  createScrollEvent(t2, e) {
    let i = this.width !== t2.width, r = this.scrollWidth !== t2.scrollWidth, n = this.scrollLeft !== t2.scrollLeft, o2 = this.height !== t2.height, l = this.scrollHeight !== t2.scrollHeight, a = this.scrollTop !== t2.scrollTop;
    return { inSmoothScrolling: e, oldWidth: t2.width, oldScrollWidth: t2.scrollWidth, oldScrollLeft: t2.scrollLeft, width: this.width, scrollWidth: this.scrollWidth, scrollLeft: this.scrollLeft, oldHeight: t2.height, oldScrollHeight: t2.scrollHeight, oldScrollTop: t2.scrollTop, height: this.height, scrollHeight: this.scrollHeight, scrollTop: this.scrollTop, widthChanged: i, scrollWidthChanged: r, scrollLeftChanged: n, heightChanged: o2, scrollHeightChanged: l, scrollTopChanged: a };
  }
};
var Ri = class extends D {
  constructor(e) {
    super();
    this._scrollableBrand = void 0;
    this._onScroll = this._register(new v());
    this.onScroll = this._onScroll.event;
    this._smoothScrollDuration = e.smoothScrollDuration, this._scheduleAtNextAnimationFrame = e.scheduleAtNextAnimationFrame, this._state = new cs(e.forceIntegerValues, 0, 0, 0, 0, 0, 0), this._smoothScrolling = null;
  }
  dispose() {
    this._smoothScrolling && (this._smoothScrolling.dispose(), this._smoothScrolling = null), super.dispose();
  }
  setSmoothScrollDuration(e) {
    this._smoothScrollDuration = e;
  }
  validateScrollPosition(e) {
    return this._state.withScrollPosition(e);
  }
  getScrollDimensions() {
    return this._state;
  }
  setScrollDimensions(e, i) {
    let r = this._state.withScrollDimensions(e, i);
    this._setState(r, !!this._smoothScrolling), this._smoothScrolling?.acceptScrollDimensions(this._state);
  }
  getFutureScrollPosition() {
    return this._smoothScrolling ? this._smoothScrolling.to : this._state;
  }
  getCurrentScrollPosition() {
    return this._state;
  }
  setScrollPositionNow(e) {
    let i = this._state.withScrollPosition(e);
    this._smoothScrolling && (this._smoothScrolling.dispose(), this._smoothScrolling = null), this._setState(i, false);
  }
  setScrollPositionSmooth(e, i) {
    if (this._smoothScrollDuration === 0) return this.setScrollPositionNow(e);
    if (this._smoothScrolling) {
      e = { scrollLeft: typeof e.scrollLeft > "u" ? this._smoothScrolling.to.scrollLeft : e.scrollLeft, scrollTop: typeof e.scrollTop > "u" ? this._smoothScrolling.to.scrollTop : e.scrollTop };
      let r = this._state.withScrollPosition(e);
      if (this._smoothScrolling.to.scrollLeft === r.scrollLeft && this._smoothScrolling.to.scrollTop === r.scrollTop) return;
      let n;
      i ? n = new Nr(this._smoothScrolling.from, r, this._smoothScrolling.startTime, this._smoothScrolling.duration) : n = this._smoothScrolling.combine(this._state, r, this._smoothScrollDuration), this._smoothScrolling.dispose(), this._smoothScrolling = n;
    } else {
      let r = this._state.withScrollPosition(e);
      this._smoothScrolling = Nr.start(this._state, r, this._smoothScrollDuration);
    }
    this._smoothScrolling.animationFrameDisposable = this._scheduleAtNextAnimationFrame(() => {
      this._smoothScrolling && (this._smoothScrolling.animationFrameDisposable = null, this._performSmoothScrolling());
    });
  }
  hasPendingScrollAnimation() {
    return !!this._smoothScrolling;
  }
  _performSmoothScrolling() {
    if (!this._smoothScrolling) return;
    let e = this._smoothScrolling.tick(), i = this._state.withScrollPosition(e);
    if (this._setState(i, true), !!this._smoothScrolling) {
      if (e.isDone) {
        this._smoothScrolling.dispose(), this._smoothScrolling = null;
        return;
      }
      this._smoothScrolling.animationFrameDisposable = this._scheduleAtNextAnimationFrame(() => {
        this._smoothScrolling && (this._smoothScrolling.animationFrameDisposable = null, this._performSmoothScrolling());
      });
    }
  }
  _setState(e, i) {
    let r = this._state;
    r.equals(e) || (this._state = e, this._onScroll.fire(this._state.createScrollEvent(r, i)));
  }
};
var Br = class {
  constructor(t2, e, i) {
    this.scrollLeft = t2, this.scrollTop = e, this.isDone = i;
  }
};
function as(s15, t2) {
  let e = t2 - s15;
  return function(i) {
    return s15 + e * ka(i);
  };
}
function La(s15, t2, e) {
  return function(i) {
    return i < e ? s15(i / e) : t2((i - e) / (1 - e));
  };
}
var Nr = class s10 {
  constructor(t2, e, i, r) {
    this.from = t2, this.to = e, this.duration = r, this.startTime = i, this.animationFrameDisposable = null, this._initAnimations();
  }
  _initAnimations() {
    this.scrollLeft = this._initAnimation(this.from.scrollLeft, this.to.scrollLeft, this.to.width), this.scrollTop = this._initAnimation(this.from.scrollTop, this.to.scrollTop, this.to.height);
  }
  _initAnimation(t2, e, i) {
    if (Math.abs(t2 - e) > 2.5 * i) {
      let n, o2;
      return t2 < e ? (n = t2 + 0.75 * i, o2 = e - 0.75 * i) : (n = t2 - 0.75 * i, o2 = e + 0.75 * i), La(as(t2, n), as(o2, e), 0.33);
    }
    return as(t2, e);
  }
  dispose() {
    this.animationFrameDisposable !== null && (this.animationFrameDisposable.dispose(), this.animationFrameDisposable = null);
  }
  acceptScrollDimensions(t2) {
    this.to = t2.withScrollPosition(this.to), this._initAnimations();
  }
  tick() {
    return this._tick(Date.now());
  }
  _tick(t2) {
    let e = (t2 - this.startTime) / this.duration;
    if (e < 1) {
      let i = this.scrollLeft(e), r = this.scrollTop(e);
      return new Br(i, r, false);
    }
    return new Br(this.to.scrollLeft, this.to.scrollTop, true);
  }
  combine(t2, e, i) {
    return s10.start(t2, e, i);
  }
  static start(t2, e, i) {
    i = i + 10;
    let r = Date.now() - 10;
    return new s10(t2, e, r, i);
  }
};
function Aa(s15) {
  return Math.pow(s15, 3);
}
function ka(s15) {
  return 1 - Aa(1 - s15);
}
var Fr = class extends D {
  constructor(t2, e, i) {
    super(), this._visibility = t2, this._visibleClassName = e, this._invisibleClassName = i, this._domNode = null, this._isVisible = false, this._isNeeded = false, this._rawShouldBeVisible = false, this._shouldBeVisible = false, this._revealTimer = this._register(new Ye());
  }
  setVisibility(t2) {
    this._visibility !== t2 && (this._visibility = t2, this._updateShouldBeVisible());
  }
  setShouldBeVisible(t2) {
    this._rawShouldBeVisible = t2, this._updateShouldBeVisible();
  }
  _applyVisibilitySetting() {
    return this._visibility === 2 ? false : this._visibility === 3 ? true : this._rawShouldBeVisible;
  }
  _updateShouldBeVisible() {
    let t2 = this._applyVisibilitySetting();
    this._shouldBeVisible !== t2 && (this._shouldBeVisible = t2, this.ensureVisibility());
  }
  setIsNeeded(t2) {
    this._isNeeded !== t2 && (this._isNeeded = t2, this.ensureVisibility());
  }
  setDomNode(t2) {
    this._domNode = t2, this._domNode.setClassName(this._invisibleClassName), this.setShouldBeVisible(false);
  }
  ensureVisibility() {
    if (!this._isNeeded) {
      this._hide(false);
      return;
    }
    this._shouldBeVisible ? this._reveal() : this._hide(true);
  }
  _reveal() {
    this._isVisible || (this._isVisible = true, this._revealTimer.setIfNotSet(() => {
      this._domNode?.setClassName(this._visibleClassName);
    }, 0));
  }
  _hide(t2) {
    this._revealTimer.cancel(), this._isVisible && (this._isVisible = false, this._domNode?.setClassName(this._invisibleClassName + (t2 ? " fade" : "")));
  }
};
var Ca = 140;
var Ut = class extends lt {
  constructor(t2) {
    super(), this._lazyRender = t2.lazyRender, this._host = t2.host, this._scrollable = t2.scrollable, this._scrollByPage = t2.scrollByPage, this._scrollbarState = t2.scrollbarState, this._visibilityController = this._register(new Fr(t2.visibility, "visible scrollbar " + t2.extraScrollbarClassName, "invisible scrollbar " + t2.extraScrollbarClassName)), this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()), this._pointerMoveMonitor = this._register(new Wt()), this._shouldRender = true, this.domNode = _t(document.createElement("div")), this.domNode.setAttribute("role", "presentation"), this.domNode.setAttribute("aria-hidden", "true"), this._visibilityController.setDomNode(this.domNode), this.domNode.setPosition("absolute"), this._register(L(this.domNode.domNode, Y.POINTER_DOWN, (e) => this._domNodePointerDown(e)));
  }
  _createArrow(t2) {
    let e = this._register(new Or(t2));
    this.domNode.domNode.appendChild(e.bgDomNode), this.domNode.domNode.appendChild(e.domNode);
  }
  _createSlider(t2, e, i, r) {
    this.slider = _t(document.createElement("div")), this.slider.setClassName("slider"), this.slider.setPosition("absolute"), this.slider.setTop(t2), this.slider.setLeft(e), typeof i == "number" && this.slider.setWidth(i), typeof r == "number" && this.slider.setHeight(r), this.slider.setLayerHinting(true), this.slider.setContain("strict"), this.domNode.domNode.appendChild(this.slider.domNode), this._register(L(this.slider.domNode, Y.POINTER_DOWN, (n) => {
      n.button === 0 && (n.preventDefault(), this._sliderPointerDown(n));
    })), this.onclick(this.slider.domNode, (n) => {
      n.leftButton && n.stopPropagation();
    });
  }
  _onElementSize(t2) {
    return this._scrollbarState.setVisibleSize(t2) && (this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()), this._shouldRender = true, this._lazyRender || this.render()), this._shouldRender;
  }
  _onElementScrollSize(t2) {
    return this._scrollbarState.setScrollSize(t2) && (this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()), this._shouldRender = true, this._lazyRender || this.render()), this._shouldRender;
  }
  _onElementScrollPosition(t2) {
    return this._scrollbarState.setScrollPosition(t2) && (this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded()), this._shouldRender = true, this._lazyRender || this.render()), this._shouldRender;
  }
  beginReveal() {
    this._visibilityController.setShouldBeVisible(true);
  }
  beginHide() {
    this._visibilityController.setShouldBeVisible(false);
  }
  render() {
    this._shouldRender && (this._shouldRender = false, this._renderDomNode(this._scrollbarState.getRectangleLargeSize(), this._scrollbarState.getRectangleSmallSize()), this._updateSlider(this._scrollbarState.getSliderSize(), this._scrollbarState.getArrowSize() + this._scrollbarState.getSliderPosition()));
  }
  _domNodePointerDown(t2) {
    t2.target === this.domNode.domNode && this._onPointerDown(t2);
  }
  delegatePointerDown(t2) {
    let e = this.domNode.domNode.getClientRects()[0].top, i = e + this._scrollbarState.getSliderPosition(), r = e + this._scrollbarState.getSliderPosition() + this._scrollbarState.getSliderSize(), n = this._sliderPointerPosition(t2);
    i <= n && n <= r ? t2.button === 0 && (t2.preventDefault(), this._sliderPointerDown(t2)) : this._onPointerDown(t2);
  }
  _onPointerDown(t2) {
    let e, i;
    if (t2.target === this.domNode.domNode && typeof t2.offsetX == "number" && typeof t2.offsetY == "number") e = t2.offsetX, i = t2.offsetY;
    else {
      let n = Fo(this.domNode.domNode);
      e = t2.pageX - n.left, i = t2.pageY - n.top;
    }
    let r = this._pointerDownRelativePosition(e, i);
    this._setDesiredScrollPositionNow(this._scrollByPage ? this._scrollbarState.getDesiredScrollPositionFromOffsetPaged(r) : this._scrollbarState.getDesiredScrollPositionFromOffset(r)), t2.button === 0 && (t2.preventDefault(), this._sliderPointerDown(t2));
  }
  _sliderPointerDown(t2) {
    if (!t2.target || !(t2.target instanceof Element)) return;
    let e = this._sliderPointerPosition(t2), i = this._sliderOrthogonalPointerPosition(t2), r = this._scrollbarState.clone();
    this.slider.toggleClassName("active", true), this._pointerMoveMonitor.startMonitoring(t2.target, t2.pointerId, t2.buttons, (n) => {
      let o2 = this._sliderOrthogonalPointerPosition(n), l = Math.abs(o2 - i);
      if (wr && l > Ca) {
        this._setDesiredScrollPositionNow(r.getScrollPosition());
        return;
      }
      let u = this._sliderPointerPosition(n) - e;
      this._setDesiredScrollPositionNow(r.getDesiredScrollPositionFromDelta(u));
    }, () => {
      this.slider.toggleClassName("active", false), this._host.onDragEnd();
    }), this._host.onDragStart();
  }
  _setDesiredScrollPositionNow(t2) {
    let e = {};
    this.writeScrollPosition(e, t2), this._scrollable.setScrollPositionNow(e);
  }
  updateScrollbarSize(t2) {
    this._updateScrollbarSize(t2), this._scrollbarState.setScrollbarSize(t2), this._shouldRender = true, this._lazyRender || this.render();
  }
  isNeeded() {
    return this._scrollbarState.isNeeded();
  }
};
var Kt = class s11 {
  constructor(t2, e, i, r, n, o2) {
    this._scrollbarSize = Math.round(e), this._oppositeScrollbarSize = Math.round(i), this._arrowSize = Math.round(t2), this._visibleSize = r, this._scrollSize = n, this._scrollPosition = o2, this._computedAvailableSize = 0, this._computedIsNeeded = false, this._computedSliderSize = 0, this._computedSliderRatio = 0, this._computedSliderPosition = 0, this._refreshComputedValues();
  }
  clone() {
    return new s11(this._arrowSize, this._scrollbarSize, this._oppositeScrollbarSize, this._visibleSize, this._scrollSize, this._scrollPosition);
  }
  setVisibleSize(t2) {
    let e = Math.round(t2);
    return this._visibleSize !== e ? (this._visibleSize = e, this._refreshComputedValues(), true) : false;
  }
  setScrollSize(t2) {
    let e = Math.round(t2);
    return this._scrollSize !== e ? (this._scrollSize = e, this._refreshComputedValues(), true) : false;
  }
  setScrollPosition(t2) {
    let e = Math.round(t2);
    return this._scrollPosition !== e ? (this._scrollPosition = e, this._refreshComputedValues(), true) : false;
  }
  setScrollbarSize(t2) {
    this._scrollbarSize = Math.round(t2);
  }
  setOppositeScrollbarSize(t2) {
    this._oppositeScrollbarSize = Math.round(t2);
  }
  static _computeValues(t2, e, i, r, n) {
    let o2 = Math.max(0, i - t2), l = Math.max(0, o2 - 2 * e), a = r > 0 && r > i;
    if (!a) return { computedAvailableSize: Math.round(o2), computedIsNeeded: a, computedSliderSize: Math.round(l), computedSliderRatio: 0, computedSliderPosition: 0 };
    let u = Math.round(Math.max(20, Math.floor(i * l / r))), h2 = (l - u) / (r - i), c = n * h2;
    return { computedAvailableSize: Math.round(o2), computedIsNeeded: a, computedSliderSize: Math.round(u), computedSliderRatio: h2, computedSliderPosition: Math.round(c) };
  }
  _refreshComputedValues() {
    let t2 = s11._computeValues(this._oppositeScrollbarSize, this._arrowSize, this._visibleSize, this._scrollSize, this._scrollPosition);
    this._computedAvailableSize = t2.computedAvailableSize, this._computedIsNeeded = t2.computedIsNeeded, this._computedSliderSize = t2.computedSliderSize, this._computedSliderRatio = t2.computedSliderRatio, this._computedSliderPosition = t2.computedSliderPosition;
  }
  getArrowSize() {
    return this._arrowSize;
  }
  getScrollPosition() {
    return this._scrollPosition;
  }
  getRectangleLargeSize() {
    return this._computedAvailableSize;
  }
  getRectangleSmallSize() {
    return this._scrollbarSize;
  }
  isNeeded() {
    return this._computedIsNeeded;
  }
  getSliderSize() {
    return this._computedSliderSize;
  }
  getSliderPosition() {
    return this._computedSliderPosition;
  }
  getDesiredScrollPositionFromOffset(t2) {
    if (!this._computedIsNeeded) return 0;
    let e = t2 - this._arrowSize - this._computedSliderSize / 2;
    return Math.round(e / this._computedSliderRatio);
  }
  getDesiredScrollPositionFromOffsetPaged(t2) {
    if (!this._computedIsNeeded) return 0;
    let e = t2 - this._arrowSize, i = this._scrollPosition;
    return e < this._computedSliderPosition ? i -= this._visibleSize : i += this._visibleSize, i;
  }
  getDesiredScrollPositionFromDelta(t2) {
    if (!this._computedIsNeeded) return 0;
    let e = this._computedSliderPosition + t2;
    return Math.round(e / this._computedSliderRatio);
  }
};
var Wr = class extends Ut {
  constructor(t2, e, i) {
    let r = t2.getScrollDimensions(), n = t2.getCurrentScrollPosition();
    if (super({ lazyRender: e.lazyRender, host: i, scrollbarState: new Kt(e.horizontalHasArrows ? e.arrowSize : 0, e.horizontal === 2 ? 0 : e.horizontalScrollbarSize, e.vertical === 2 ? 0 : e.verticalScrollbarSize, r.width, r.scrollWidth, n.scrollLeft), visibility: e.horizontal, extraScrollbarClassName: "horizontal", scrollable: t2, scrollByPage: e.scrollByPage }), e.horizontalHasArrows) throw new Error("horizontalHasArrows is not supported in xterm.js");
    this._createSlider(Math.floor((e.horizontalScrollbarSize - e.horizontalSliderSize) / 2), 0, void 0, e.horizontalSliderSize);
  }
  _updateSlider(t2, e) {
    this.slider.setWidth(t2), this.slider.setLeft(e);
  }
  _renderDomNode(t2, e) {
    this.domNode.setWidth(t2), this.domNode.setHeight(e), this.domNode.setLeft(0), this.domNode.setBottom(0);
  }
  onDidScroll(t2) {
    return this._shouldRender = this._onElementScrollSize(t2.scrollWidth) || this._shouldRender, this._shouldRender = this._onElementScrollPosition(t2.scrollLeft) || this._shouldRender, this._shouldRender = this._onElementSize(t2.width) || this._shouldRender, this._shouldRender;
  }
  _pointerDownRelativePosition(t2, e) {
    return t2;
  }
  _sliderPointerPosition(t2) {
    return t2.pageX;
  }
  _sliderOrthogonalPointerPosition(t2) {
    return t2.pageY;
  }
  _updateScrollbarSize(t2) {
    this.slider.setHeight(t2);
  }
  writeScrollPosition(t2, e) {
    t2.scrollLeft = e;
  }
  updateOptions(t2) {
    this.updateScrollbarSize(t2.horizontal === 2 ? 0 : t2.horizontalScrollbarSize), this._scrollbarState.setOppositeScrollbarSize(t2.vertical === 2 ? 0 : t2.verticalScrollbarSize), this._visibilityController.setVisibility(t2.horizontal), this._scrollByPage = t2.scrollByPage;
  }
};
var Ur = class extends Ut {
  constructor(t2, e, i) {
    let r = t2.getScrollDimensions(), n = t2.getCurrentScrollPosition();
    if (super({ lazyRender: e.lazyRender, host: i, scrollbarState: new Kt(e.verticalHasArrows ? e.arrowSize : 0, e.vertical === 2 ? 0 : e.verticalScrollbarSize, 0, r.height, r.scrollHeight, n.scrollTop), visibility: e.vertical, extraScrollbarClassName: "vertical", scrollable: t2, scrollByPage: e.scrollByPage }), e.verticalHasArrows) throw new Error("horizontalHasArrows is not supported in xterm.js");
    this._createSlider(0, Math.floor((e.verticalScrollbarSize - e.verticalSliderSize) / 2), e.verticalSliderSize, void 0);
  }
  _updateSlider(t2, e) {
    this.slider.setHeight(t2), this.slider.setTop(e);
  }
  _renderDomNode(t2, e) {
    this.domNode.setWidth(e), this.domNode.setHeight(t2), this.domNode.setRight(0), this.domNode.setTop(0);
  }
  onDidScroll(t2) {
    return this._shouldRender = this._onElementScrollSize(t2.scrollHeight) || this._shouldRender, this._shouldRender = this._onElementScrollPosition(t2.scrollTop) || this._shouldRender, this._shouldRender = this._onElementSize(t2.height) || this._shouldRender, this._shouldRender;
  }
  _pointerDownRelativePosition(t2, e) {
    return e;
  }
  _sliderPointerPosition(t2) {
    return t2.pageY;
  }
  _sliderOrthogonalPointerPosition(t2) {
    return t2.pageX;
  }
  _updateScrollbarSize(t2) {
    this.slider.setWidth(t2);
  }
  writeScrollPosition(t2, e) {
    t2.scrollTop = e;
  }
  updateOptions(t2) {
    this.updateScrollbarSize(t2.vertical === 2 ? 0 : t2.verticalScrollbarSize), this._scrollbarState.setOppositeScrollbarSize(0), this._visibilityController.setVisibility(t2.vertical), this._scrollByPage = t2.scrollByPage;
  }
};
var Ma = 500;
var Ko = 50;
var zo = true;
var us = class {
  constructor(t2, e, i) {
    this.timestamp = t2, this.deltaX = e, this.deltaY = i, this.score = 0;
  }
};
var zr = class zr2 {
  constructor() {
    this._capacity = 5, this._memory = [], this._front = -1, this._rear = -1;
  }
  isPhysicalMouseWheel() {
    if (this._front === -1 && this._rear === -1) return false;
    let t2 = 1, e = 0, i = 1, r = this._rear;
    do {
      let n = r === this._front ? t2 : Math.pow(2, -i);
      if (t2 -= n, e += this._memory[r].score * n, r === this._front) break;
      r = (this._capacity + r - 1) % this._capacity, i++;
    } while (true);
    return e <= 0.5;
  }
  acceptStandardWheelEvent(t2) {
    if (Ti) {
      let e = be(t2.browserEvent), i = mo(e);
      this.accept(Date.now(), t2.deltaX * i, t2.deltaY * i);
    } else this.accept(Date.now(), t2.deltaX, t2.deltaY);
  }
  accept(t2, e, i) {
    let r = null, n = new us(t2, e, i);
    this._front === -1 && this._rear === -1 ? (this._memory[0] = n, this._front = 0, this._rear = 0) : (r = this._memory[this._rear], this._rear = (this._rear + 1) % this._capacity, this._rear === this._front && (this._front = (this._front + 1) % this._capacity), this._memory[this._rear] = n), n.score = this._computeScore(n, r);
  }
  _computeScore(t2, e) {
    if (Math.abs(t2.deltaX) > 0 && Math.abs(t2.deltaY) > 0) return 1;
    let i = 0.5;
    if ((!this._isAlmostInt(t2.deltaX) || !this._isAlmostInt(t2.deltaY)) && (i += 0.25), e) {
      let r = Math.abs(t2.deltaX), n = Math.abs(t2.deltaY), o2 = Math.abs(e.deltaX), l = Math.abs(e.deltaY), a = Math.max(Math.min(r, o2), 1), u = Math.max(Math.min(n, l), 1), h2 = Math.max(r, o2), c = Math.max(n, l);
      h2 % a === 0 && c % u === 0 && (i -= 0.5);
    }
    return Math.min(Math.max(i, 0), 1);
  }
  _isAlmostInt(t2) {
    return Math.abs(Math.round(t2) - t2) < 0.01;
  }
};
zr.INSTANCE = new zr();
var hs = zr;
var ds = class extends lt {
  constructor(e, i, r) {
    super();
    this._onScroll = this._register(new v());
    this.onScroll = this._onScroll.event;
    this._onWillScroll = this._register(new v());
    this.onWillScroll = this._onWillScroll.event;
    this._options = Pa(i), this._scrollable = r, this._register(this._scrollable.onScroll((o2) => {
      this._onWillScroll.fire(o2), this._onDidScroll(o2), this._onScroll.fire(o2);
    }));
    let n = { onMouseWheel: (o2) => this._onMouseWheel(o2), onDragStart: () => this._onDragStart(), onDragEnd: () => this._onDragEnd() };
    this._verticalScrollbar = this._register(new Ur(this._scrollable, this._options, n)), this._horizontalScrollbar = this._register(new Wr(this._scrollable, this._options, n)), this._domNode = document.createElement("div"), this._domNode.className = "xterm-scrollable-element " + this._options.className, this._domNode.setAttribute("role", "presentation"), this._domNode.style.position = "relative", this._domNode.appendChild(e), this._domNode.appendChild(this._horizontalScrollbar.domNode.domNode), this._domNode.appendChild(this._verticalScrollbar.domNode.domNode), this._options.useShadows ? (this._leftShadowDomNode = _t(document.createElement("div")), this._leftShadowDomNode.setClassName("shadow"), this._domNode.appendChild(this._leftShadowDomNode.domNode), this._topShadowDomNode = _t(document.createElement("div")), this._topShadowDomNode.setClassName("shadow"), this._domNode.appendChild(this._topShadowDomNode.domNode), this._topLeftShadowDomNode = _t(document.createElement("div")), this._topLeftShadowDomNode.setClassName("shadow"), this._domNode.appendChild(this._topLeftShadowDomNode.domNode)) : (this._leftShadowDomNode = null, this._topShadowDomNode = null, this._topLeftShadowDomNode = null), this._listenOnDomNode = this._options.listenOnDomNode || this._domNode, this._mouseWheelToDispose = [], this._setListeningToMouseWheel(this._options.handleMouseWheel), this.onmouseover(this._listenOnDomNode, (o2) => this._onMouseOver(o2)), this.onmouseleave(this._listenOnDomNode, (o2) => this._onMouseLeave(o2)), this._hideTimeout = this._register(new Ye()), this._isDragging = false, this._mouseIsOver = false, this._shouldRender = true, this._revealOnScroll = true;
  }
  get options() {
    return this._options;
  }
  dispose() {
    this._mouseWheelToDispose = Ne(this._mouseWheelToDispose), super.dispose();
  }
  getDomNode() {
    return this._domNode;
  }
  getOverviewRulerLayoutInfo() {
    return { parent: this._domNode, insertBefore: this._verticalScrollbar.domNode.domNode };
  }
  delegateVerticalScrollbarPointerDown(e) {
    this._verticalScrollbar.delegatePointerDown(e);
  }
  getScrollDimensions() {
    return this._scrollable.getScrollDimensions();
  }
  setScrollDimensions(e) {
    this._scrollable.setScrollDimensions(e, false);
  }
  updateClassName(e) {
    this._options.className = e, Te && (this._options.className += " mac"), this._domNode.className = "xterm-scrollable-element " + this._options.className;
  }
  updateOptions(e) {
    typeof e.handleMouseWheel < "u" && (this._options.handleMouseWheel = e.handleMouseWheel, this._setListeningToMouseWheel(this._options.handleMouseWheel)), typeof e.mouseWheelScrollSensitivity < "u" && (this._options.mouseWheelScrollSensitivity = e.mouseWheelScrollSensitivity), typeof e.fastScrollSensitivity < "u" && (this._options.fastScrollSensitivity = e.fastScrollSensitivity), typeof e.scrollPredominantAxis < "u" && (this._options.scrollPredominantAxis = e.scrollPredominantAxis), typeof e.horizontal < "u" && (this._options.horizontal = e.horizontal), typeof e.vertical < "u" && (this._options.vertical = e.vertical), typeof e.horizontalScrollbarSize < "u" && (this._options.horizontalScrollbarSize = e.horizontalScrollbarSize), typeof e.verticalScrollbarSize < "u" && (this._options.verticalScrollbarSize = e.verticalScrollbarSize), typeof e.scrollByPage < "u" && (this._options.scrollByPage = e.scrollByPage), this._horizontalScrollbar.updateOptions(this._options), this._verticalScrollbar.updateOptions(this._options), this._options.lazyRender || this._render();
  }
  setRevealOnScroll(e) {
    this._revealOnScroll = e;
  }
  delegateScrollFromMouseWheelEvent(e) {
    this._onMouseWheel(new xi(e));
  }
  _setListeningToMouseWheel(e) {
    if (this._mouseWheelToDispose.length > 0 !== e && (this._mouseWheelToDispose = Ne(this._mouseWheelToDispose), e)) {
      let r = (n) => {
        this._onMouseWheel(new xi(n));
      };
      this._mouseWheelToDispose.push(L(this._listenOnDomNode, Y.MOUSE_WHEEL, r, { passive: false }));
    }
  }
  _onMouseWheel(e) {
    if (e.browserEvent?.defaultPrevented) return;
    let i = hs.INSTANCE;
    zo && i.acceptStandardWheelEvent(e);
    let r = false;
    if (e.deltaY || e.deltaX) {
      let o2 = e.deltaY * this._options.mouseWheelScrollSensitivity, l = e.deltaX * this._options.mouseWheelScrollSensitivity;
      this._options.scrollPredominantAxis && (this._options.scrollYToX && l + o2 === 0 ? l = o2 = 0 : Math.abs(o2) >= Math.abs(l) ? l = 0 : o2 = 0), this._options.flipAxes && ([o2, l] = [l, o2]);
      let a = !Te && e.browserEvent && e.browserEvent.shiftKey;
      (this._options.scrollYToX || a) && !l && (l = o2, o2 = 0), e.browserEvent && e.browserEvent.altKey && (l = l * this._options.fastScrollSensitivity, o2 = o2 * this._options.fastScrollSensitivity);
      let u = this._scrollable.getFutureScrollPosition(), h2 = {};
      if (o2) {
        let c = Ko * o2, d = u.scrollTop - (c < 0 ? Math.floor(c) : Math.ceil(c));
        this._verticalScrollbar.writeScrollPosition(h2, d);
      }
      if (l) {
        let c = Ko * l, d = u.scrollLeft - (c < 0 ? Math.floor(c) : Math.ceil(c));
        this._horizontalScrollbar.writeScrollPosition(h2, d);
      }
      h2 = this._scrollable.validateScrollPosition(h2), (u.scrollLeft !== h2.scrollLeft || u.scrollTop !== h2.scrollTop) && (zo && this._options.mouseWheelSmoothScroll && i.isPhysicalMouseWheel() ? this._scrollable.setScrollPositionSmooth(h2) : this._scrollable.setScrollPositionNow(h2), r = true);
    }
    let n = r;
    !n && this._options.alwaysConsumeMouseWheel && (n = true), !n && this._options.consumeMouseWheelIfScrollbarIsNeeded && (this._verticalScrollbar.isNeeded() || this._horizontalScrollbar.isNeeded()) && (n = true), n && (e.preventDefault(), e.stopPropagation());
  }
  _onDidScroll(e) {
    this._shouldRender = this._horizontalScrollbar.onDidScroll(e) || this._shouldRender, this._shouldRender = this._verticalScrollbar.onDidScroll(e) || this._shouldRender, this._options.useShadows && (this._shouldRender = true), this._revealOnScroll && this._reveal(), this._options.lazyRender || this._render();
  }
  renderNow() {
    if (!this._options.lazyRender) throw new Error("Please use `lazyRender` together with `renderNow`!");
    this._render();
  }
  _render() {
    if (this._shouldRender && (this._shouldRender = false, this._horizontalScrollbar.render(), this._verticalScrollbar.render(), this._options.useShadows)) {
      let e = this._scrollable.getCurrentScrollPosition(), i = e.scrollTop > 0, r = e.scrollLeft > 0, n = r ? " left" : "", o2 = i ? " top" : "", l = r || i ? " top-left-corner" : "";
      this._leftShadowDomNode.setClassName(`shadow${n}`), this._topShadowDomNode.setClassName(`shadow${o2}`), this._topLeftShadowDomNode.setClassName(`shadow${l}${o2}${n}`);
    }
  }
  _onDragStart() {
    this._isDragging = true, this._reveal();
  }
  _onDragEnd() {
    this._isDragging = false, this._hide();
  }
  _onMouseLeave(e) {
    this._mouseIsOver = false, this._hide();
  }
  _onMouseOver(e) {
    this._mouseIsOver = true, this._reveal();
  }
  _reveal() {
    this._verticalScrollbar.beginReveal(), this._horizontalScrollbar.beginReveal(), this._scheduleHide();
  }
  _hide() {
    !this._mouseIsOver && !this._isDragging && (this._verticalScrollbar.beginHide(), this._horizontalScrollbar.beginHide());
  }
  _scheduleHide() {
    !this._mouseIsOver && !this._isDragging && this._hideTimeout.cancelAndSet(() => this._hide(), Ma);
  }
};
var Kr = class extends ds {
  constructor(t2, e, i) {
    super(t2, e, i);
  }
  setScrollPosition(t2) {
    t2.reuseAnimation ? this._scrollable.setScrollPositionSmooth(t2, t2.reuseAnimation) : this._scrollable.setScrollPositionNow(t2);
  }
  getScrollPosition() {
    return this._scrollable.getCurrentScrollPosition();
  }
};
function Pa(s15) {
  let t2 = { lazyRender: typeof s15.lazyRender < "u" ? s15.lazyRender : false, className: typeof s15.className < "u" ? s15.className : "", useShadows: typeof s15.useShadows < "u" ? s15.useShadows : true, handleMouseWheel: typeof s15.handleMouseWheel < "u" ? s15.handleMouseWheel : true, flipAxes: typeof s15.flipAxes < "u" ? s15.flipAxes : false, consumeMouseWheelIfScrollbarIsNeeded: typeof s15.consumeMouseWheelIfScrollbarIsNeeded < "u" ? s15.consumeMouseWheelIfScrollbarIsNeeded : false, alwaysConsumeMouseWheel: typeof s15.alwaysConsumeMouseWheel < "u" ? s15.alwaysConsumeMouseWheel : false, scrollYToX: typeof s15.scrollYToX < "u" ? s15.scrollYToX : false, mouseWheelScrollSensitivity: typeof s15.mouseWheelScrollSensitivity < "u" ? s15.mouseWheelScrollSensitivity : 1, fastScrollSensitivity: typeof s15.fastScrollSensitivity < "u" ? s15.fastScrollSensitivity : 5, scrollPredominantAxis: typeof s15.scrollPredominantAxis < "u" ? s15.scrollPredominantAxis : true, mouseWheelSmoothScroll: typeof s15.mouseWheelSmoothScroll < "u" ? s15.mouseWheelSmoothScroll : true, arrowSize: typeof s15.arrowSize < "u" ? s15.arrowSize : 11, listenOnDomNode: typeof s15.listenOnDomNode < "u" ? s15.listenOnDomNode : null, horizontal: typeof s15.horizontal < "u" ? s15.horizontal : 1, horizontalScrollbarSize: typeof s15.horizontalScrollbarSize < "u" ? s15.horizontalScrollbarSize : 10, horizontalSliderSize: typeof s15.horizontalSliderSize < "u" ? s15.horizontalSliderSize : 0, horizontalHasArrows: typeof s15.horizontalHasArrows < "u" ? s15.horizontalHasArrows : false, vertical: typeof s15.vertical < "u" ? s15.vertical : 1, verticalScrollbarSize: typeof s15.verticalScrollbarSize < "u" ? s15.verticalScrollbarSize : 10, verticalHasArrows: typeof s15.verticalHasArrows < "u" ? s15.verticalHasArrows : false, verticalSliderSize: typeof s15.verticalSliderSize < "u" ? s15.verticalSliderSize : 0, scrollByPage: typeof s15.scrollByPage < "u" ? s15.scrollByPage : false };
  return t2.horizontalSliderSize = typeof s15.horizontalSliderSize < "u" ? s15.horizontalSliderSize : t2.horizontalScrollbarSize, t2.verticalSliderSize = typeof s15.verticalSliderSize < "u" ? s15.verticalSliderSize : t2.verticalScrollbarSize, Te && (t2.className += " mac"), t2;
}
var zt = class extends D {
  constructor(e, i, r, n, o2, l, a, u) {
    super();
    this._bufferService = r;
    this._optionsService = a;
    this._renderService = u;
    this._onRequestScrollLines = this._register(new v());
    this.onRequestScrollLines = this._onRequestScrollLines.event;
    this._isSyncing = false;
    this._isHandlingScroll = false;
    this._suppressOnScrollHandler = false;
    let h2 = this._register(new Ri({ forceIntegerValues: false, smoothScrollDuration: this._optionsService.rawOptions.smoothScrollDuration, scheduleAtNextAnimationFrame: (c) => mt(n.window, c) }));
    this._register(this._optionsService.onSpecificOptionChange("smoothScrollDuration", () => {
      h2.setSmoothScrollDuration(this._optionsService.rawOptions.smoothScrollDuration);
    })), this._scrollableElement = this._register(new Kr(i, { vertical: 1, horizontal: 2, useShadows: false, mouseWheelSmoothScroll: true, ...this._getChangeOptions() }, h2)), this._register(this._optionsService.onMultipleOptionChange(["scrollSensitivity", "fastScrollSensitivity", "overviewRuler"], () => this._scrollableElement.updateOptions(this._getChangeOptions()))), this._register(o2.onProtocolChange((c) => {
      this._scrollableElement.updateOptions({ handleMouseWheel: !(c & 16) });
    })), this._scrollableElement.setScrollDimensions({ height: 0, scrollHeight: 0 }), this._register($.runAndSubscribe(l.onChangeColors, () => {
      this._scrollableElement.getDomNode().style.backgroundColor = l.colors.background.css;
    })), e.appendChild(this._scrollableElement.getDomNode()), this._register(C(() => this._scrollableElement.getDomNode().remove())), this._styleElement = n.mainDocument.createElement("style"), i.appendChild(this._styleElement), this._register(C(() => this._styleElement.remove())), this._register($.runAndSubscribe(l.onChangeColors, () => {
      this._styleElement.textContent = [".xterm .xterm-scrollable-element > .scrollbar > .slider {", `  background: ${l.colors.scrollbarSliderBackground.css};`, "}", ".xterm .xterm-scrollable-element > .scrollbar > .slider:hover {", `  background: ${l.colors.scrollbarSliderHoverBackground.css};`, "}", ".xterm .xterm-scrollable-element > .scrollbar > .slider.active {", `  background: ${l.colors.scrollbarSliderActiveBackground.css};`, "}"].join(`
`);
    })), this._register(this._bufferService.onResize(() => this.queueSync())), this._register(this._bufferService.buffers.onBufferActivate(() => {
      this._latestYDisp = void 0, this.queueSync();
    })), this._register(this._bufferService.onScroll(() => this._sync())), this._register(this._scrollableElement.onScroll((c) => this._handleScroll(c)));
  }
  scrollLines(e) {
    let i = this._scrollableElement.getScrollPosition();
    this._scrollableElement.setScrollPosition({ reuseAnimation: true, scrollTop: i.scrollTop + e * this._renderService.dimensions.css.cell.height });
  }
  scrollToLine(e, i) {
    i && (this._latestYDisp = e), this._scrollableElement.setScrollPosition({ reuseAnimation: !i, scrollTop: e * this._renderService.dimensions.css.cell.height });
  }
  _getChangeOptions() {
    return { mouseWheelScrollSensitivity: this._optionsService.rawOptions.scrollSensitivity, fastScrollSensitivity: this._optionsService.rawOptions.fastScrollSensitivity, verticalScrollbarSize: this._optionsService.rawOptions.overviewRuler?.width || 14 };
  }
  queueSync(e) {
    e !== void 0 && (this._latestYDisp = e), this._queuedAnimationFrame === void 0 && (this._queuedAnimationFrame = this._renderService.addRefreshCallback(() => {
      this._queuedAnimationFrame = void 0, this._sync(this._latestYDisp);
    }));
  }
  _sync(e = this._bufferService.buffer.ydisp) {
    !this._renderService || this._isSyncing || (this._isSyncing = true, this._suppressOnScrollHandler = true, this._scrollableElement.setScrollDimensions({ height: this._renderService.dimensions.css.canvas.height, scrollHeight: this._renderService.dimensions.css.cell.height * this._bufferService.buffer.lines.length }), this._suppressOnScrollHandler = false, e !== this._latestYDisp && this._scrollableElement.setScrollPosition({ scrollTop: e * this._renderService.dimensions.css.cell.height }), this._isSyncing = false);
  }
  _handleScroll(e) {
    if (!this._renderService || this._isHandlingScroll || this._suppressOnScrollHandler) return;
    this._isHandlingScroll = true;
    let i = Math.round(e.scrollTop / this._renderService.dimensions.css.cell.height), r = i - this._bufferService.buffer.ydisp;
    r !== 0 && (this._latestYDisp = i, this._onRequestScrollLines.fire(r)), this._isHandlingScroll = false;
  }
};
zt = M([S(2, F), S(3, ae), S(4, rr), S(5, Re), S(6, H), S(7, ce)], zt);
var Gt = class extends D {
  constructor(e, i, r, n, o2) {
    super();
    this._screenElement = e;
    this._bufferService = i;
    this._coreBrowserService = r;
    this._decorationService = n;
    this._renderService = o2;
    this._decorationElements = /* @__PURE__ */ new Map();
    this._altBufferIsActive = false;
    this._dimensionsChanged = false;
    this._container = document.createElement("div"), this._container.classList.add("xterm-decoration-container"), this._screenElement.appendChild(this._container), this._register(this._renderService.onRenderedViewportChange(() => this._doRefreshDecorations())), this._register(this._renderService.onDimensionsChange(() => {
      this._dimensionsChanged = true, this._queueRefresh();
    })), this._register(this._coreBrowserService.onDprChange(() => this._queueRefresh())), this._register(this._bufferService.buffers.onBufferActivate(() => {
      this._altBufferIsActive = this._bufferService.buffer === this._bufferService.buffers.alt;
    })), this._register(this._decorationService.onDecorationRegistered(() => this._queueRefresh())), this._register(this._decorationService.onDecorationRemoved((l) => this._removeDecoration(l))), this._register(C(() => {
      this._container.remove(), this._decorationElements.clear();
    }));
  }
  _queueRefresh() {
    this._animationFrame === void 0 && (this._animationFrame = this._renderService.addRefreshCallback(() => {
      this._doRefreshDecorations(), this._animationFrame = void 0;
    }));
  }
  _doRefreshDecorations() {
    for (let e of this._decorationService.decorations) this._renderDecoration(e);
    this._dimensionsChanged = false;
  }
  _renderDecoration(e) {
    this._refreshStyle(e), this._dimensionsChanged && this._refreshXPosition(e);
  }
  _createElement(e) {
    let i = this._coreBrowserService.mainDocument.createElement("div");
    i.classList.add("xterm-decoration"), i.classList.toggle("xterm-decoration-top-layer", e?.options?.layer === "top"), i.style.width = `${Math.round((e.options.width || 1) * this._renderService.dimensions.css.cell.width)}px`, i.style.height = `${(e.options.height || 1) * this._renderService.dimensions.css.cell.height}px`, i.style.top = `${(e.marker.line - this._bufferService.buffers.active.ydisp) * this._renderService.dimensions.css.cell.height}px`, i.style.lineHeight = `${this._renderService.dimensions.css.cell.height}px`;
    let r = e.options.x ?? 0;
    return r && r > this._bufferService.cols && (i.style.display = "none"), this._refreshXPosition(e, i), i;
  }
  _refreshStyle(e) {
    let i = e.marker.line - this._bufferService.buffers.active.ydisp;
    if (i < 0 || i >= this._bufferService.rows) e.element && (e.element.style.display = "none", e.onRenderEmitter.fire(e.element));
    else {
      let r = this._decorationElements.get(e);
      r || (r = this._createElement(e), e.element = r, this._decorationElements.set(e, r), this._container.appendChild(r), e.onDispose(() => {
        this._decorationElements.delete(e), r.remove();
      })), r.style.display = this._altBufferIsActive ? "none" : "block", this._altBufferIsActive || (r.style.width = `${Math.round((e.options.width || 1) * this._renderService.dimensions.css.cell.width)}px`, r.style.height = `${(e.options.height || 1) * this._renderService.dimensions.css.cell.height}px`, r.style.top = `${i * this._renderService.dimensions.css.cell.height}px`, r.style.lineHeight = `${this._renderService.dimensions.css.cell.height}px`), e.onRenderEmitter.fire(r);
    }
  }
  _refreshXPosition(e, i = e.element) {
    if (!i) return;
    let r = e.options.x ?? 0;
    (e.options.anchor || "left") === "right" ? i.style.right = r ? `${r * this._renderService.dimensions.css.cell.width}px` : "" : i.style.left = r ? `${r * this._renderService.dimensions.css.cell.width}px` : "";
  }
  _removeDecoration(e) {
    this._decorationElements.get(e)?.remove(), this._decorationElements.delete(e), e.dispose();
  }
};
Gt = M([S(1, F), S(2, ae), S(3, Be), S(4, ce)], Gt);
var Gr = class {
  constructor() {
    this._zones = [];
    this._zonePool = [];
    this._zonePoolIndex = 0;
    this._linePadding = { full: 0, left: 0, center: 0, right: 0 };
  }
  get zones() {
    return this._zonePool.length = Math.min(this._zonePool.length, this._zones.length), this._zones;
  }
  clear() {
    this._zones.length = 0, this._zonePoolIndex = 0;
  }
  addDecoration(t2) {
    if (t2.options.overviewRulerOptions) {
      for (let e of this._zones) if (e.color === t2.options.overviewRulerOptions.color && e.position === t2.options.overviewRulerOptions.position) {
        if (this._lineIntersectsZone(e, t2.marker.line)) return;
        if (this._lineAdjacentToZone(e, t2.marker.line, t2.options.overviewRulerOptions.position)) {
          this._addLineToZone(e, t2.marker.line);
          return;
        }
      }
      if (this._zonePoolIndex < this._zonePool.length) {
        this._zonePool[this._zonePoolIndex].color = t2.options.overviewRulerOptions.color, this._zonePool[this._zonePoolIndex].position = t2.options.overviewRulerOptions.position, this._zonePool[this._zonePoolIndex].startBufferLine = t2.marker.line, this._zonePool[this._zonePoolIndex].endBufferLine = t2.marker.line, this._zones.push(this._zonePool[this._zonePoolIndex++]);
        return;
      }
      this._zones.push({ color: t2.options.overviewRulerOptions.color, position: t2.options.overviewRulerOptions.position, startBufferLine: t2.marker.line, endBufferLine: t2.marker.line }), this._zonePool.push(this._zones[this._zones.length - 1]), this._zonePoolIndex++;
    }
  }
  setPadding(t2) {
    this._linePadding = t2;
  }
  _lineIntersectsZone(t2, e) {
    return e >= t2.startBufferLine && e <= t2.endBufferLine;
  }
  _lineAdjacentToZone(t2, e, i) {
    return e >= t2.startBufferLine - this._linePadding[i || "full"] && e <= t2.endBufferLine + this._linePadding[i || "full"];
  }
  _addLineToZone(t2, e) {
    t2.startBufferLine = Math.min(t2.startBufferLine, e), t2.endBufferLine = Math.max(t2.endBufferLine, e);
  }
};
var We = { full: 0, left: 0, center: 0, right: 0 };
var at = { full: 0, left: 0, center: 0, right: 0 };
var Li = { full: 0, left: 0, center: 0, right: 0 };
var bt = class extends D {
  constructor(e, i, r, n, o2, l, a, u) {
    super();
    this._viewportElement = e;
    this._screenElement = i;
    this._bufferService = r;
    this._decorationService = n;
    this._renderService = o2;
    this._optionsService = l;
    this._themeService = a;
    this._coreBrowserService = u;
    this._colorZoneStore = new Gr();
    this._shouldUpdateDimensions = true;
    this._shouldUpdateAnchor = true;
    this._lastKnownBufferLength = 0;
    this._canvas = this._coreBrowserService.mainDocument.createElement("canvas"), this._canvas.classList.add("xterm-decoration-overview-ruler"), this._refreshCanvasDimensions(), this._viewportElement.parentElement?.insertBefore(this._canvas, this._viewportElement), this._register(C(() => this._canvas?.remove()));
    let h2 = this._canvas.getContext("2d");
    if (h2) this._ctx = h2;
    else throw new Error("Ctx cannot be null");
    this._register(this._decorationService.onDecorationRegistered(() => this._queueRefresh(void 0, true))), this._register(this._decorationService.onDecorationRemoved(() => this._queueRefresh(void 0, true))), this._register(this._renderService.onRenderedViewportChange(() => this._queueRefresh())), this._register(this._bufferService.buffers.onBufferActivate(() => {
      this._canvas.style.display = this._bufferService.buffer === this._bufferService.buffers.alt ? "none" : "block";
    })), this._register(this._bufferService.onScroll(() => {
      this._lastKnownBufferLength !== this._bufferService.buffers.normal.lines.length && (this._refreshDrawHeightConstants(), this._refreshColorZonePadding());
    })), this._register(this._renderService.onRender(() => {
      (!this._containerHeight || this._containerHeight !== this._screenElement.clientHeight) && (this._queueRefresh(true), this._containerHeight = this._screenElement.clientHeight);
    })), this._register(this._coreBrowserService.onDprChange(() => this._queueRefresh(true))), this._register(this._optionsService.onSpecificOptionChange("overviewRuler", () => this._queueRefresh(true))), this._register(this._themeService.onChangeColors(() => this._queueRefresh())), this._queueRefresh(true);
  }
  get _width() {
    return this._optionsService.options.overviewRuler?.width || 0;
  }
  _refreshDrawConstants() {
    let e = Math.floor((this._canvas.width - 1) / 3), i = Math.ceil((this._canvas.width - 1) / 3);
    at.full = this._canvas.width, at.left = e, at.center = i, at.right = e, this._refreshDrawHeightConstants(), Li.full = 1, Li.left = 1, Li.center = 1 + at.left, Li.right = 1 + at.left + at.center;
  }
  _refreshDrawHeightConstants() {
    We.full = Math.round(2 * this._coreBrowserService.dpr);
    let e = this._canvas.height / this._bufferService.buffer.lines.length, i = Math.round(Math.max(Math.min(e, 12), 6) * this._coreBrowserService.dpr);
    We.left = i, We.center = i, We.right = i;
  }
  _refreshColorZonePadding() {
    this._colorZoneStore.setPadding({ full: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * We.full), left: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * We.left), center: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * We.center), right: Math.floor(this._bufferService.buffers.active.lines.length / (this._canvas.height - 1) * We.right) }), this._lastKnownBufferLength = this._bufferService.buffers.normal.lines.length;
  }
  _refreshCanvasDimensions() {
    this._canvas.style.width = `${this._width}px`, this._canvas.width = Math.round(this._width * this._coreBrowserService.dpr), this._canvas.style.height = `${this._screenElement.clientHeight}px`, this._canvas.height = Math.round(this._screenElement.clientHeight * this._coreBrowserService.dpr), this._refreshDrawConstants(), this._refreshColorZonePadding();
  }
  _refreshDecorations() {
    this._shouldUpdateDimensions && this._refreshCanvasDimensions(), this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height), this._colorZoneStore.clear();
    for (let i of this._decorationService.decorations) this._colorZoneStore.addDecoration(i);
    this._ctx.lineWidth = 1, this._renderRulerOutline();
    let e = this._colorZoneStore.zones;
    for (let i of e) i.position !== "full" && this._renderColorZone(i);
    for (let i of e) i.position === "full" && this._renderColorZone(i);
    this._shouldUpdateDimensions = false, this._shouldUpdateAnchor = false;
  }
  _renderRulerOutline() {
    this._ctx.fillStyle = this._themeService.colors.overviewRulerBorder.css, this._ctx.fillRect(0, 0, 1, this._canvas.height), this._optionsService.rawOptions.overviewRuler.showTopBorder && this._ctx.fillRect(1, 0, this._canvas.width - 1, 1), this._optionsService.rawOptions.overviewRuler.showBottomBorder && this._ctx.fillRect(1, this._canvas.height - 1, this._canvas.width - 1, this._canvas.height);
  }
  _renderColorZone(e) {
    this._ctx.fillStyle = e.color, this._ctx.fillRect(Li[e.position || "full"], Math.round((this._canvas.height - 1) * (e.startBufferLine / this._bufferService.buffers.active.lines.length) - We[e.position || "full"] / 2), at[e.position || "full"], Math.round((this._canvas.height - 1) * ((e.endBufferLine - e.startBufferLine) / this._bufferService.buffers.active.lines.length) + We[e.position || "full"]));
  }
  _queueRefresh(e, i) {
    this._shouldUpdateDimensions = e || this._shouldUpdateDimensions, this._shouldUpdateAnchor = i || this._shouldUpdateAnchor, this._animationFrame === void 0 && (this._animationFrame = this._coreBrowserService.window.requestAnimationFrame(() => {
      this._refreshDecorations(), this._animationFrame = void 0;
    }));
  }
};
bt = M([S(2, F), S(3, Be), S(4, ce), S(5, H), S(6, Re), S(7, ae)], bt);
var b;
((E) => (E.NUL = "\0", E.SOH = "", E.STX = "", E.ETX = "", E.EOT = "", E.ENQ = "", E.ACK = "", E.BEL = "\x07", E.BS = "\b", E.HT = "	", E.LF = `
`, E.VT = "\v", E.FF = "\f", E.CR = "\r", E.SO = "", E.SI = "", E.DLE = "", E.DC1 = "", E.DC2 = "", E.DC3 = "", E.DC4 = "", E.NAK = "", E.SYN = "", E.ETB = "", E.CAN = "", E.EM = "", E.SUB = "", E.ESC = "\x1B", E.FS = "", E.GS = "", E.RS = "", E.US = "", E.SP = " ", E.DEL = "\x7F"))(b ||= {});
var Ai;
((g) => (g.PAD = "\x80", g.HOP = "\x81", g.BPH = "\x82", g.NBH = "\x83", g.IND = "\x84", g.NEL = "\x85", g.SSA = "\x86", g.ESA = "\x87", g.HTS = "\x88", g.HTJ = "\x89", g.VTS = "\x8A", g.PLD = "\x8B", g.PLU = "\x8C", g.RI = "\x8D", g.SS2 = "\x8E", g.SS3 = "\x8F", g.DCS = "\x90", g.PU1 = "\x91", g.PU2 = "\x92", g.STS = "\x93", g.CCH = "\x94", g.MW = "\x95", g.SPA = "\x96", g.EPA = "\x97", g.SOS = "\x98", g.SGCI = "\x99", g.SCI = "\x9A", g.CSI = "\x9B", g.ST = "\x9C", g.OSC = "\x9D", g.PM = "\x9E", g.APC = "\x9F"))(Ai ||= {});
var fs;
((t2) => t2.ST = `${b.ESC}\\`)(fs ||= {});
var $t = class {
  constructor(t2, e, i, r, n, o2) {
    this._textarea = t2;
    this._compositionView = e;
    this._bufferService = i;
    this._optionsService = r;
    this._coreService = n;
    this._renderService = o2;
    this._isComposing = false, this._isSendingComposition = false, this._compositionPosition = { start: 0, end: 0 }, this._dataAlreadySent = "";
  }
  get isComposing() {
    return this._isComposing;
  }
  compositionstart() {
    this._isComposing = true, this._compositionPosition.start = this._textarea.value.length, this._compositionView.textContent = "", this._dataAlreadySent = "", this._compositionView.classList.add("active");
  }
  compositionupdate(t2) {
    this._compositionView.textContent = t2.data, this.updateCompositionElements(), setTimeout(() => {
      this._compositionPosition.end = this._textarea.value.length;
    }, 0);
  }
  compositionend() {
    this._finalizeComposition(true);
  }
  keydown(t2) {
    if (this._isComposing || this._isSendingComposition) {
      if (t2.keyCode === 20 || t2.keyCode === 229 || t2.keyCode === 16 || t2.keyCode === 17 || t2.keyCode === 18) return false;
      this._finalizeComposition(false);
    }
    return t2.keyCode === 229 ? (this._handleAnyTextareaChanges(), false) : true;
  }
  _finalizeComposition(t2) {
    if (this._compositionView.classList.remove("active"), this._isComposing = false, t2) {
      let e = { start: this._compositionPosition.start, end: this._compositionPosition.end };
      this._isSendingComposition = true, setTimeout(() => {
        if (this._isSendingComposition) {
          this._isSendingComposition = false;
          let i;
          e.start += this._dataAlreadySent.length, this._isComposing ? i = this._textarea.value.substring(e.start, this._compositionPosition.start) : i = this._textarea.value.substring(e.start), i.length > 0 && this._coreService.triggerDataEvent(i, true);
        }
      }, 0);
    } else {
      this._isSendingComposition = false;
      let e = this._textarea.value.substring(this._compositionPosition.start, this._compositionPosition.end);
      this._coreService.triggerDataEvent(e, true);
    }
  }
  _handleAnyTextareaChanges() {
    let t2 = this._textarea.value;
    setTimeout(() => {
      if (!this._isComposing) {
        let e = this._textarea.value, i = e.replace(t2, "");
        this._dataAlreadySent = i, e.length > t2.length ? this._coreService.triggerDataEvent(i, true) : e.length < t2.length ? this._coreService.triggerDataEvent(`${b.DEL}`, true) : e.length === t2.length && e !== t2 && this._coreService.triggerDataEvent(e, true);
      }
    }, 0);
  }
  updateCompositionElements(t2) {
    if (this._isComposing) {
      if (this._bufferService.buffer.isCursorInViewport) {
        let e = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1), i = this._renderService.dimensions.css.cell.height, r = this._bufferService.buffer.y * this._renderService.dimensions.css.cell.height, n = e * this._renderService.dimensions.css.cell.width;
        this._compositionView.style.left = n + "px", this._compositionView.style.top = r + "px", this._compositionView.style.height = i + "px", this._compositionView.style.lineHeight = i + "px", this._compositionView.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._compositionView.style.fontSize = this._optionsService.rawOptions.fontSize + "px";
        let o2 = this._compositionView.getBoundingClientRect();
        this._textarea.style.left = n + "px", this._textarea.style.top = r + "px", this._textarea.style.width = Math.max(o2.width, 1) + "px", this._textarea.style.height = Math.max(o2.height, 1) + "px", this._textarea.style.lineHeight = o2.height + "px";
      }
      t2 || setTimeout(() => this.updateCompositionElements(true), 0);
    }
  }
};
$t = M([S(2, F), S(3, H), S(4, ge), S(5, ce)], $t);
var ue = 0;
var he = 0;
var de = 0;
var J = 0;
var ps = { css: "#00000000", rgba: 0 };
var j;
((i) => {
  function s15(r, n, o2, l) {
    return l !== void 0 ? `#${vt(r)}${vt(n)}${vt(o2)}${vt(l)}` : `#${vt(r)}${vt(n)}${vt(o2)}`;
  }
  i.toCss = s15;
  function t2(r, n, o2, l = 255) {
    return (r << 24 | n << 16 | o2 << 8 | l) >>> 0;
  }
  i.toRgba = t2;
  function e(r, n, o2, l) {
    return { css: i.toCss(r, n, o2, l), rgba: i.toRgba(r, n, o2, l) };
  }
  i.toColor = e;
})(j ||= {});
var U;
((l) => {
  function s15(a, u) {
    if (J = (u.rgba & 255) / 255, J === 1) return { css: u.css, rgba: u.rgba };
    let h2 = u.rgba >> 24 & 255, c = u.rgba >> 16 & 255, d = u.rgba >> 8 & 255, _2 = a.rgba >> 24 & 255, p = a.rgba >> 16 & 255, m = a.rgba >> 8 & 255;
    ue = _2 + Math.round((h2 - _2) * J), he = p + Math.round((c - p) * J), de = m + Math.round((d - m) * J);
    let f = j.toCss(ue, he, de), A = j.toRgba(ue, he, de);
    return { css: f, rgba: A };
  }
  l.blend = s15;
  function t2(a) {
    return (a.rgba & 255) === 255;
  }
  l.isOpaque = t2;
  function e(a, u, h2) {
    let c = $r.ensureContrastRatio(a.rgba, u.rgba, h2);
    if (c) return j.toColor(c >> 24 & 255, c >> 16 & 255, c >> 8 & 255);
  }
  l.ensureContrastRatio = e;
  function i(a) {
    let u = (a.rgba | 255) >>> 0;
    return [ue, he, de] = $r.toChannels(u), { css: j.toCss(ue, he, de), rgba: u };
  }
  l.opaque = i;
  function r(a, u) {
    return J = Math.round(u * 255), [ue, he, de] = $r.toChannels(a.rgba), { css: j.toCss(ue, he, de, J), rgba: j.toRgba(ue, he, de, J) };
  }
  l.opacity = r;
  function n(a, u) {
    return J = a.rgba & 255, r(a, J * u / 255);
  }
  l.multiplyOpacity = n;
  function o2(a) {
    return [a.rgba >> 24 & 255, a.rgba >> 16 & 255, a.rgba >> 8 & 255];
  }
  l.toColorRGB = o2;
})(U ||= {});
var z;
((i) => {
  let s15, t2;
  try {
    let r = document.createElement("canvas");
    r.width = 1, r.height = 1;
    let n = r.getContext("2d", { willReadFrequently: true });
    n && (s15 = n, s15.globalCompositeOperation = "copy", t2 = s15.createLinearGradient(0, 0, 1, 1));
  } catch {
  }
  function e(r) {
    if (r.match(/#[\da-f]{3,8}/i)) switch (r.length) {
      case 4:
        return ue = parseInt(r.slice(1, 2).repeat(2), 16), he = parseInt(r.slice(2, 3).repeat(2), 16), de = parseInt(r.slice(3, 4).repeat(2), 16), j.toColor(ue, he, de);
      case 5:
        return ue = parseInt(r.slice(1, 2).repeat(2), 16), he = parseInt(r.slice(2, 3).repeat(2), 16), de = parseInt(r.slice(3, 4).repeat(2), 16), J = parseInt(r.slice(4, 5).repeat(2), 16), j.toColor(ue, he, de, J);
      case 7:
        return { css: r, rgba: (parseInt(r.slice(1), 16) << 8 | 255) >>> 0 };
      case 9:
        return { css: r, rgba: parseInt(r.slice(1), 16) >>> 0 };
    }
    let n = r.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|\d?\.(\d+))\s*)?\)/);
    if (n) return ue = parseInt(n[1]), he = parseInt(n[2]), de = parseInt(n[3]), J = Math.round((n[5] === void 0 ? 1 : parseFloat(n[5])) * 255), j.toColor(ue, he, de, J);
    if (!s15 || !t2) throw new Error("css.toColor: Unsupported css format");
    if (s15.fillStyle = t2, s15.fillStyle = r, typeof s15.fillStyle != "string") throw new Error("css.toColor: Unsupported css format");
    if (s15.fillRect(0, 0, 1, 1), [ue, he, de, J] = s15.getImageData(0, 0, 1, 1).data, J !== 255) throw new Error("css.toColor: Unsupported css format");
    return { rgba: j.toRgba(ue, he, de, J), css: r };
  }
  i.toColor = e;
})(z ||= {});
var ve;
((e) => {
  function s15(i) {
    return t2(i >> 16 & 255, i >> 8 & 255, i & 255);
  }
  e.relativeLuminance = s15;
  function t2(i, r, n) {
    let o2 = i / 255, l = r / 255, a = n / 255, u = o2 <= 0.03928 ? o2 / 12.92 : Math.pow((o2 + 0.055) / 1.055, 2.4), h2 = l <= 0.03928 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4), c = a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
    return u * 0.2126 + h2 * 0.7152 + c * 0.0722;
  }
  e.relativeLuminance2 = t2;
})(ve ||= {});
var $r;
((n) => {
  function s15(o2, l) {
    if (J = (l & 255) / 255, J === 1) return l;
    let a = l >> 24 & 255, u = l >> 16 & 255, h2 = l >> 8 & 255, c = o2 >> 24 & 255, d = o2 >> 16 & 255, _2 = o2 >> 8 & 255;
    return ue = c + Math.round((a - c) * J), he = d + Math.round((u - d) * J), de = _2 + Math.round((h2 - _2) * J), j.toRgba(ue, he, de);
  }
  n.blend = s15;
  function t2(o2, l, a) {
    let u = ve.relativeLuminance(o2 >> 8), h2 = ve.relativeLuminance(l >> 8);
    if (Xe(u, h2) < a) {
      if (h2 < u) {
        let p = e(o2, l, a), m = Xe(u, ve.relativeLuminance(p >> 8));
        if (m < a) {
          let f = i(o2, l, a), A = Xe(u, ve.relativeLuminance(f >> 8));
          return m > A ? p : f;
        }
        return p;
      }
      let d = i(o2, l, a), _2 = Xe(u, ve.relativeLuminance(d >> 8));
      if (_2 < a) {
        let p = e(o2, l, a), m = Xe(u, ve.relativeLuminance(p >> 8));
        return _2 > m ? d : p;
      }
      return d;
    }
  }
  n.ensureContrastRatio = t2;
  function e(o2, l, a) {
    let u = o2 >> 24 & 255, h2 = o2 >> 16 & 255, c = o2 >> 8 & 255, d = l >> 24 & 255, _2 = l >> 16 & 255, p = l >> 8 & 255, m = Xe(ve.relativeLuminance2(d, _2, p), ve.relativeLuminance2(u, h2, c));
    for (; m < a && (d > 0 || _2 > 0 || p > 0); ) d -= Math.max(0, Math.ceil(d * 0.1)), _2 -= Math.max(0, Math.ceil(_2 * 0.1)), p -= Math.max(0, Math.ceil(p * 0.1)), m = Xe(ve.relativeLuminance2(d, _2, p), ve.relativeLuminance2(u, h2, c));
    return (d << 24 | _2 << 16 | p << 8 | 255) >>> 0;
  }
  n.reduceLuminance = e;
  function i(o2, l, a) {
    let u = o2 >> 24 & 255, h2 = o2 >> 16 & 255, c = o2 >> 8 & 255, d = l >> 24 & 255, _2 = l >> 16 & 255, p = l >> 8 & 255, m = Xe(ve.relativeLuminance2(d, _2, p), ve.relativeLuminance2(u, h2, c));
    for (; m < a && (d < 255 || _2 < 255 || p < 255); ) d = Math.min(255, d + Math.ceil((255 - d) * 0.1)), _2 = Math.min(255, _2 + Math.ceil((255 - _2) * 0.1)), p = Math.min(255, p + Math.ceil((255 - p) * 0.1)), m = Xe(ve.relativeLuminance2(d, _2, p), ve.relativeLuminance2(u, h2, c));
    return (d << 24 | _2 << 16 | p << 8 | 255) >>> 0;
  }
  n.increaseLuminance = i;
  function r(o2) {
    return [o2 >> 24 & 255, o2 >> 16 & 255, o2 >> 8 & 255, o2 & 255];
  }
  n.toChannels = r;
})($r ||= {});
function vt(s15) {
  let t2 = s15.toString(16);
  return t2.length < 2 ? "0" + t2 : t2;
}
function Xe(s15, t2) {
  return s15 < t2 ? (t2 + 0.05) / (s15 + 0.05) : (s15 + 0.05) / (t2 + 0.05);
}
var Vr = class extends De {
  constructor(e, i, r) {
    super();
    this.content = 0;
    this.combinedData = "";
    this.fg = e.fg, this.bg = e.bg, this.combinedData = i, this._width = r;
  }
  isCombined() {
    return 2097152;
  }
  getWidth() {
    return this._width;
  }
  getChars() {
    return this.combinedData;
  }
  getCode() {
    return 2097151;
  }
  setFromCharData(e) {
    throw new Error("not implemented");
  }
  getAsCharData() {
    return [this.fg, this.getChars(), this.getWidth(), this.getCode()];
  }
};
var ct = class {
  constructor(t2) {
    this._bufferService = t2;
    this._characterJoiners = [];
    this._nextCharacterJoinerId = 0;
    this._workCell = new q();
  }
  register(t2) {
    let e = { id: this._nextCharacterJoinerId++, handler: t2 };
    return this._characterJoiners.push(e), e.id;
  }
  deregister(t2) {
    for (let e = 0; e < this._characterJoiners.length; e++) if (this._characterJoiners[e].id === t2) return this._characterJoiners.splice(e, 1), true;
    return false;
  }
  getJoinedCharacters(t2) {
    if (this._characterJoiners.length === 0) return [];
    let e = this._bufferService.buffer.lines.get(t2);
    if (!e || e.length === 0) return [];
    let i = [], r = e.translateToString(true), n = 0, o2 = 0, l = 0, a = e.getFg(0), u = e.getBg(0);
    for (let h2 = 0; h2 < e.getTrimmedLength(); h2++) if (e.loadCell(h2, this._workCell), this._workCell.getWidth() !== 0) {
      if (this._workCell.fg !== a || this._workCell.bg !== u) {
        if (h2 - n > 1) {
          let c = this._getJoinedRanges(r, l, o2, e, n);
          for (let d = 0; d < c.length; d++) i.push(c[d]);
        }
        n = h2, l = o2, a = this._workCell.fg, u = this._workCell.bg;
      }
      o2 += this._workCell.getChars().length || we.length;
    }
    if (this._bufferService.cols - n > 1) {
      let h2 = this._getJoinedRanges(r, l, o2, e, n);
      for (let c = 0; c < h2.length; c++) i.push(h2[c]);
    }
    return i;
  }
  _getJoinedRanges(t2, e, i, r, n) {
    let o2 = t2.substring(e, i), l = [];
    try {
      l = this._characterJoiners[0].handler(o2);
    } catch (a) {
      console.error(a);
    }
    for (let a = 1; a < this._characterJoiners.length; a++) try {
      let u = this._characterJoiners[a].handler(o2);
      for (let h2 = 0; h2 < u.length; h2++) ct._mergeRanges(l, u[h2]);
    } catch (u) {
      console.error(u);
    }
    return this._stringRangesToCellRanges(l, r, n), l;
  }
  _stringRangesToCellRanges(t2, e, i) {
    let r = 0, n = false, o2 = 0, l = t2[r];
    if (l) {
      for (let a = i; a < this._bufferService.cols; a++) {
        let u = e.getWidth(a), h2 = e.getString(a).length || we.length;
        if (u !== 0) {
          if (!n && l[0] <= o2 && (l[0] = a, n = true), l[1] <= o2) {
            if (l[1] = a, l = t2[++r], !l) break;
            l[0] <= o2 ? (l[0] = a, n = true) : n = false;
          }
          o2 += h2;
        }
      }
      l && (l[1] = this._bufferService.cols);
    }
  }
  static _mergeRanges(t2, e) {
    let i = false;
    for (let r = 0; r < t2.length; r++) {
      let n = t2[r];
      if (i) {
        if (e[1] <= n[0]) return t2[r - 1][1] = e[1], t2;
        if (e[1] <= n[1]) return t2[r - 1][1] = Math.max(e[1], n[1]), t2.splice(r, 1), t2;
        t2.splice(r, 1), r--;
      } else {
        if (e[1] <= n[0]) return t2.splice(r, 0, e), t2;
        if (e[1] <= n[1]) return n[0] = Math.min(e[0], n[0]), t2;
        e[0] < n[1] && (n[0] = Math.min(e[0], n[0]), i = true);
        continue;
      }
    }
    return i ? t2[t2.length - 1][1] = e[1] : t2.push(e), t2;
  }
};
ct = M([S(0, F)], ct);
function Oa(s15) {
  return 57508 <= s15 && s15 <= 57558;
}
function Ba(s15) {
  return 9472 <= s15 && s15 <= 9631;
}
function $o(s15) {
  return Oa(s15) || Ba(s15);
}
function Vo() {
  return { css: { canvas: qr(), cell: qr() }, device: { canvas: qr(), cell: qr(), char: { width: 0, height: 0, left: 0, top: 0 } } };
}
function qr() {
  return { width: 0, height: 0 };
}
var Vt = class {
  constructor(t2, e, i, r, n, o2, l) {
    this._document = t2;
    this._characterJoinerService = e;
    this._optionsService = i;
    this._coreBrowserService = r;
    this._coreService = n;
    this._decorationService = o2;
    this._themeService = l;
    this._workCell = new q();
    this._columnSelectMode = false;
    this.defaultSpacing = 0;
  }
  handleSelectionChanged(t2, e, i) {
    this._selectionStart = t2, this._selectionEnd = e, this._columnSelectMode = i;
  }
  createRow(t2, e, i, r, n, o2, l, a, u, h2, c) {
    let d = [], _2 = this._characterJoinerService.getJoinedCharacters(e), p = this._themeService.colors, m = t2.getNoBgTrimmedLength();
    i && m < o2 + 1 && (m = o2 + 1);
    let f, A = 0, R = "", O = 0, I = 0, k = 0, P = 0, oe = false, Me = 0, Pe = false, Ke = 0, di = 0, V = [], Qe = h2 !== -1 && c !== -1;
    for (let y = 0; y < m; y++) {
      t2.loadCell(y, this._workCell);
      let T = this._workCell.getWidth();
      if (T === 0) continue;
      let g = false, w = y >= di, E = y, x = this._workCell;
      if (_2.length > 0 && y === _2[0][0] && w) {
        let W = _2.shift(), An = this._isCellInSelection(W[0], e);
        for (O = W[0] + 1; O < W[1]; O++) w &&= An === this._isCellInSelection(O, e);
        w &&= !i || o2 < W[0] || o2 >= W[1], w ? (g = true, x = new Vr(this._workCell, t2.translateToString(true, W[0], W[1]), W[1] - W[0]), E = W[1] - 1, T = x.getWidth()) : di = W[1];
      }
      let N = this._isCellInSelection(y, e), Z = i && y === o2, te = Qe && y >= h2 && y <= c, Oe = false;
      this._decorationService.forEachDecorationAtCell(y, e, void 0, (W) => {
        Oe = true;
      });
      let ze = x.getChars() || we;
      if (ze === " " && (x.isUnderline() || x.isOverline()) && (ze = "\xA0"), Ke = T * a - u.get(ze, x.isBold(), x.isItalic()), !f) f = this._document.createElement("span");
      else if (A && (N && Pe || !N && !Pe && x.bg === I) && (N && Pe && p.selectionForeground || x.fg === k) && x.extended.ext === P && te === oe && Ke === Me && !Z && !g && !Oe && w) {
        x.isInvisible() ? R += we : R += ze, A++;
        continue;
      } else A && (f.textContent = R), f = this._document.createElement("span"), A = 0, R = "";
      if (I = x.bg, k = x.fg, P = x.extended.ext, oe = te, Me = Ke, Pe = N, g && o2 >= y && o2 <= E && (o2 = y), !this._coreService.isCursorHidden && Z && this._coreService.isCursorInitialized) {
        if (V.push("xterm-cursor"), this._coreBrowserService.isFocused) l && V.push("xterm-cursor-blink"), V.push(r === "bar" ? "xterm-cursor-bar" : r === "underline" ? "xterm-cursor-underline" : "xterm-cursor-block");
        else if (n) switch (n) {
          case "outline":
            V.push("xterm-cursor-outline");
            break;
          case "block":
            V.push("xterm-cursor-block");
            break;
          case "bar":
            V.push("xterm-cursor-bar");
            break;
          case "underline":
            V.push("xterm-cursor-underline");
            break;
          default:
            break;
        }
      }
      if (x.isBold() && V.push("xterm-bold"), x.isItalic() && V.push("xterm-italic"), x.isDim() && V.push("xterm-dim"), x.isInvisible() ? R = we : R = x.getChars() || we, x.isUnderline() && (V.push(`xterm-underline-${x.extended.underlineStyle}`), R === " " && (R = "\xA0"), !x.isUnderlineColorDefault())) if (x.isUnderlineColorRGB()) f.style.textDecorationColor = `rgb(${De.toColorRGB(x.getUnderlineColor()).join(",")})`;
      else {
        let W = x.getUnderlineColor();
        this._optionsService.rawOptions.drawBoldTextInBrightColors && x.isBold() && W < 8 && (W += 8), f.style.textDecorationColor = p.ansi[W].css;
      }
      x.isOverline() && (V.push("xterm-overline"), R === " " && (R = "\xA0")), x.isStrikethrough() && V.push("xterm-strikethrough"), te && (f.style.textDecoration = "underline");
      let le = x.getFgColor(), et = x.getFgColorMode(), me = x.getBgColor(), ht = x.getBgColorMode(), fi = !!x.isInverse();
      if (fi) {
        let W = le;
        le = me, me = W;
        let An = et;
        et = ht, ht = An;
      }
      let tt2, Qi, pi = false;
      this._decorationService.forEachDecorationAtCell(y, e, void 0, (W) => {
        W.options.layer !== "top" && pi || (W.backgroundColorRGB && (ht = 50331648, me = W.backgroundColorRGB.rgba >> 8 & 16777215, tt2 = W.backgroundColorRGB), W.foregroundColorRGB && (et = 50331648, le = W.foregroundColorRGB.rgba >> 8 & 16777215, Qi = W.foregroundColorRGB), pi = W.options.layer === "top");
      }), !pi && N && (tt2 = this._coreBrowserService.isFocused ? p.selectionBackgroundOpaque : p.selectionInactiveBackgroundOpaque, me = tt2.rgba >> 8 & 16777215, ht = 50331648, pi = true, p.selectionForeground && (et = 50331648, le = p.selectionForeground.rgba >> 8 & 16777215, Qi = p.selectionForeground)), pi && V.push("xterm-decoration-top");
      let it;
      switch (ht) {
        case 16777216:
        case 33554432:
          it = p.ansi[me], V.push(`xterm-bg-${me}`);
          break;
        case 50331648:
          it = j.toColor(me >> 16, me >> 8 & 255, me & 255), this._addStyle(f, `background-color:#${qo((me >>> 0).toString(16), "0", 6)}`);
          break;
        case 0:
        default:
          fi ? (it = p.foreground, V.push(`xterm-bg-${257}`)) : it = p.background;
      }
      switch (tt2 || x.isDim() && (tt2 = U.multiplyOpacity(it, 0.5)), et) {
        case 16777216:
        case 33554432:
          x.isBold() && le < 8 && this._optionsService.rawOptions.drawBoldTextInBrightColors && (le += 8), this._applyMinimumContrast(f, it, p.ansi[le], x, tt2, void 0) || V.push(`xterm-fg-${le}`);
          break;
        case 50331648:
          let W = j.toColor(le >> 16 & 255, le >> 8 & 255, le & 255);
          this._applyMinimumContrast(f, it, W, x, tt2, Qi) || this._addStyle(f, `color:#${qo(le.toString(16), "0", 6)}`);
          break;
        case 0:
        default:
          this._applyMinimumContrast(f, it, p.foreground, x, tt2, Qi) || fi && V.push(`xterm-fg-${257}`);
      }
      V.length && (f.className = V.join(" "), V.length = 0), !Z && !g && !Oe && w ? A++ : f.textContent = R, Ke !== this.defaultSpacing && (f.style.letterSpacing = `${Ke}px`), d.push(f), y = E;
    }
    return f && A && (f.textContent = R), d;
  }
  _applyMinimumContrast(t2, e, i, r, n, o2) {
    if (this._optionsService.rawOptions.minimumContrastRatio === 1 || $o(r.getCode())) return false;
    let l = this._getContrastCache(r), a;
    if (!n && !o2 && (a = l.getColor(e.rgba, i.rgba)), a === void 0) {
      let u = this._optionsService.rawOptions.minimumContrastRatio / (r.isDim() ? 2 : 1);
      a = U.ensureContrastRatio(n || e, o2 || i, u), l.setColor((n || e).rgba, (o2 || i).rgba, a ?? null);
    }
    return a ? (this._addStyle(t2, `color:${a.css}`), true) : false;
  }
  _getContrastCache(t2) {
    return t2.isDim() ? this._themeService.colors.halfContrastCache : this._themeService.colors.contrastCache;
  }
  _addStyle(t2, e) {
    t2.setAttribute("style", `${t2.getAttribute("style") || ""}${e};`);
  }
  _isCellInSelection(t2, e) {
    let i = this._selectionStart, r = this._selectionEnd;
    return !i || !r ? false : this._columnSelectMode ? i[0] <= r[0] ? t2 >= i[0] && e >= i[1] && t2 < r[0] && e <= r[1] : t2 < i[0] && e >= i[1] && t2 >= r[0] && e <= r[1] : e > i[1] && e < r[1] || i[1] === r[1] && e === i[1] && t2 >= i[0] && t2 < r[0] || i[1] < r[1] && e === r[1] && t2 < r[0] || i[1] < r[1] && e === i[1] && t2 >= i[0];
  }
};
Vt = M([S(1, or), S(2, H), S(3, ae), S(4, ge), S(5, Be), S(6, Re)], Vt);
function qo(s15, t2, e) {
  for (; s15.length < e; ) s15 = t2 + s15;
  return s15;
}
var Yr = class {
  constructor(t2, e) {
    this._flat = new Float32Array(256);
    this._font = "";
    this._fontSize = 0;
    this._weight = "normal";
    this._weightBold = "bold";
    this._measureElements = [];
    this._container = t2.createElement("div"), this._container.classList.add("xterm-width-cache-measure-container"), this._container.setAttribute("aria-hidden", "true"), this._container.style.whiteSpace = "pre", this._container.style.fontKerning = "none";
    let i = t2.createElement("span");
    i.classList.add("xterm-char-measure-element");
    let r = t2.createElement("span");
    r.classList.add("xterm-char-measure-element"), r.style.fontWeight = "bold";
    let n = t2.createElement("span");
    n.classList.add("xterm-char-measure-element"), n.style.fontStyle = "italic";
    let o2 = t2.createElement("span");
    o2.classList.add("xterm-char-measure-element"), o2.style.fontWeight = "bold", o2.style.fontStyle = "italic", this._measureElements = [i, r, n, o2], this._container.appendChild(i), this._container.appendChild(r), this._container.appendChild(n), this._container.appendChild(o2), e.appendChild(this._container), this.clear();
  }
  dispose() {
    this._container.remove(), this._measureElements.length = 0, this._holey = void 0;
  }
  clear() {
    this._flat.fill(-9999), this._holey = /* @__PURE__ */ new Map();
  }
  setFont(t2, e, i, r) {
    t2 === this._font && e === this._fontSize && i === this._weight && r === this._weightBold || (this._font = t2, this._fontSize = e, this._weight = i, this._weightBold = r, this._container.style.fontFamily = this._font, this._container.style.fontSize = `${this._fontSize}px`, this._measureElements[0].style.fontWeight = `${i}`, this._measureElements[1].style.fontWeight = `${r}`, this._measureElements[2].style.fontWeight = `${i}`, this._measureElements[3].style.fontWeight = `${r}`, this.clear());
  }
  get(t2, e, i) {
    let r = 0;
    if (!e && !i && t2.length === 1 && (r = t2.charCodeAt(0)) < 256) {
      if (this._flat[r] !== -9999) return this._flat[r];
      let l = this._measure(t2, 0);
      return l > 0 && (this._flat[r] = l), l;
    }
    let n = t2;
    e && (n += "B"), i && (n += "I");
    let o2 = this._holey.get(n);
    if (o2 === void 0) {
      let l = 0;
      e && (l |= 1), i && (l |= 2), o2 = this._measure(t2, l), o2 > 0 && this._holey.set(n, o2);
    }
    return o2;
  }
  _measure(t2, e) {
    let i = this._measureElements[e];
    return i.textContent = t2.repeat(32), i.offsetWidth / 32;
  }
};
var ms = class {
  constructor() {
    this.clear();
  }
  clear() {
    this.hasSelection = false, this.columnSelectMode = false, this.viewportStartRow = 0, this.viewportEndRow = 0, this.viewportCappedStartRow = 0, this.viewportCappedEndRow = 0, this.startCol = 0, this.endCol = 0, this.selectionStart = void 0, this.selectionEnd = void 0;
  }
  update(t2, e, i, r = false) {
    if (this.selectionStart = e, this.selectionEnd = i, !e || !i || e[0] === i[0] && e[1] === i[1]) {
      this.clear();
      return;
    }
    let n = t2.buffers.active.ydisp, o2 = e[1] - n, l = i[1] - n, a = Math.max(o2, 0), u = Math.min(l, t2.rows - 1);
    if (a >= t2.rows || u < 0) {
      this.clear();
      return;
    }
    this.hasSelection = true, this.columnSelectMode = r, this.viewportStartRow = o2, this.viewportEndRow = l, this.viewportCappedStartRow = a, this.viewportCappedEndRow = u, this.startCol = e[0], this.endCol = i[0];
  }
  isCellSelected(t2, e, i) {
    return this.hasSelection ? (i -= t2.buffer.active.viewportY, this.columnSelectMode ? this.startCol <= this.endCol ? e >= this.startCol && i >= this.viewportCappedStartRow && e < this.endCol && i <= this.viewportCappedEndRow : e < this.startCol && i >= this.viewportCappedStartRow && e >= this.endCol && i <= this.viewportCappedEndRow : i > this.viewportStartRow && i < this.viewportEndRow || this.viewportStartRow === this.viewportEndRow && i === this.viewportStartRow && e >= this.startCol && e < this.endCol || this.viewportStartRow < this.viewportEndRow && i === this.viewportEndRow && e < this.endCol || this.viewportStartRow < this.viewportEndRow && i === this.viewportStartRow && e >= this.startCol) : false;
  }
};
function Yo() {
  return new ms();
}
var _s = "xterm-dom-renderer-owner-";
var Le = "xterm-rows";
var jr = "xterm-fg-";
var jo = "xterm-bg-";
var ki = "xterm-focus";
var Xr = "xterm-selection";
var Na = 1;
var Yt = class extends D {
  constructor(e, i, r, n, o2, l, a, u, h2, c, d, _2, p, m) {
    super();
    this._terminal = e;
    this._document = i;
    this._element = r;
    this._screenElement = n;
    this._viewportElement = o2;
    this._helperContainer = l;
    this._linkifier2 = a;
    this._charSizeService = h2;
    this._optionsService = c;
    this._bufferService = d;
    this._coreService = _2;
    this._coreBrowserService = p;
    this._themeService = m;
    this._terminalClass = Na++;
    this._rowElements = [];
    this._selectionRenderModel = Yo();
    this.onRequestRedraw = this._register(new v()).event;
    this._rowContainer = this._document.createElement("div"), this._rowContainer.classList.add(Le), this._rowContainer.style.lineHeight = "normal", this._rowContainer.setAttribute("aria-hidden", "true"), this._refreshRowElements(this._bufferService.cols, this._bufferService.rows), this._selectionContainer = this._document.createElement("div"), this._selectionContainer.classList.add(Xr), this._selectionContainer.setAttribute("aria-hidden", "true"), this.dimensions = Vo(), this._updateDimensions(), this._register(this._optionsService.onOptionChange(() => this._handleOptionsChanged())), this._register(this._themeService.onChangeColors((f) => this._injectCss(f))), this._injectCss(this._themeService.colors), this._rowFactory = u.createInstance(Vt, document), this._element.classList.add(_s + this._terminalClass), this._screenElement.appendChild(this._rowContainer), this._screenElement.appendChild(this._selectionContainer), this._register(this._linkifier2.onShowLinkUnderline((f) => this._handleLinkHover(f))), this._register(this._linkifier2.onHideLinkUnderline((f) => this._handleLinkLeave(f))), this._register(C(() => {
      this._element.classList.remove(_s + this._terminalClass), this._rowContainer.remove(), this._selectionContainer.remove(), this._widthCache.dispose(), this._themeStyleElement.remove(), this._dimensionsStyleElement.remove();
    })), this._widthCache = new Yr(this._document, this._helperContainer), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
  }
  _updateDimensions() {
    let e = this._coreBrowserService.dpr;
    this.dimensions.device.char.width = this._charSizeService.width * e, this.dimensions.device.char.height = Math.ceil(this._charSizeService.height * e), this.dimensions.device.cell.width = this.dimensions.device.char.width + Math.round(this._optionsService.rawOptions.letterSpacing), this.dimensions.device.cell.height = Math.floor(this.dimensions.device.char.height * this._optionsService.rawOptions.lineHeight), this.dimensions.device.char.left = 0, this.dimensions.device.char.top = 0, this.dimensions.device.canvas.width = this.dimensions.device.cell.width * this._bufferService.cols, this.dimensions.device.canvas.height = this.dimensions.device.cell.height * this._bufferService.rows, this.dimensions.css.canvas.width = Math.round(this.dimensions.device.canvas.width / e), this.dimensions.css.canvas.height = Math.round(this.dimensions.device.canvas.height / e), this.dimensions.css.cell.width = this.dimensions.css.canvas.width / this._bufferService.cols, this.dimensions.css.cell.height = this.dimensions.css.canvas.height / this._bufferService.rows;
    for (let r of this._rowElements) r.style.width = `${this.dimensions.css.canvas.width}px`, r.style.height = `${this.dimensions.css.cell.height}px`, r.style.lineHeight = `${this.dimensions.css.cell.height}px`, r.style.overflow = "hidden";
    this._dimensionsStyleElement || (this._dimensionsStyleElement = this._document.createElement("style"), this._screenElement.appendChild(this._dimensionsStyleElement));
    let i = `${this._terminalSelector} .${Le} span { display: inline-block; height: 100%; vertical-align: top;}`;
    this._dimensionsStyleElement.textContent = i, this._selectionContainer.style.height = this._viewportElement.style.height, this._screenElement.style.width = `${this.dimensions.css.canvas.width}px`, this._screenElement.style.height = `${this.dimensions.css.canvas.height}px`;
  }
  _injectCss(e) {
    this._themeStyleElement || (this._themeStyleElement = this._document.createElement("style"), this._screenElement.appendChild(this._themeStyleElement));
    let i = `${this._terminalSelector} .${Le} { pointer-events: none; color: ${e.foreground.css}; font-family: ${this._optionsService.rawOptions.fontFamily}; font-size: ${this._optionsService.rawOptions.fontSize}px; font-kerning: none; white-space: pre}`;
    i += `${this._terminalSelector} .${Le} .xterm-dim { color: ${U.multiplyOpacity(e.foreground, 0.5).css};}`, i += `${this._terminalSelector} span:not(.xterm-bold) { font-weight: ${this._optionsService.rawOptions.fontWeight};}${this._terminalSelector} span.xterm-bold { font-weight: ${this._optionsService.rawOptions.fontWeightBold};}${this._terminalSelector} span.xterm-italic { font-style: italic;}`;
    let r = `blink_underline_${this._terminalClass}`, n = `blink_bar_${this._terminalClass}`, o2 = `blink_block_${this._terminalClass}`;
    i += `@keyframes ${r} { 50% {  border-bottom-style: hidden; }}`, i += `@keyframes ${n} { 50% {  box-shadow: none; }}`, i += `@keyframes ${o2} { 0% {  background-color: ${e.cursor.css};  color: ${e.cursorAccent.css}; } 50% {  background-color: inherit;  color: ${e.cursor.css}; }}`, i += `${this._terminalSelector} .${Le}.${ki} .xterm-cursor.xterm-cursor-blink.xterm-cursor-underline { animation: ${r} 1s step-end infinite;}${this._terminalSelector} .${Le}.${ki} .xterm-cursor.xterm-cursor-blink.xterm-cursor-bar { animation: ${n} 1s step-end infinite;}${this._terminalSelector} .${Le}.${ki} .xterm-cursor.xterm-cursor-blink.xterm-cursor-block { animation: ${o2} 1s step-end infinite;}${this._terminalSelector} .${Le} .xterm-cursor.xterm-cursor-block { background-color: ${e.cursor.css}; color: ${e.cursorAccent.css};}${this._terminalSelector} .${Le} .xterm-cursor.xterm-cursor-block:not(.xterm-cursor-blink) { background-color: ${e.cursor.css} !important; color: ${e.cursorAccent.css} !important;}${this._terminalSelector} .${Le} .xterm-cursor.xterm-cursor-outline { outline: 1px solid ${e.cursor.css}; outline-offset: -1px;}${this._terminalSelector} .${Le} .xterm-cursor.xterm-cursor-bar { box-shadow: ${this._optionsService.rawOptions.cursorWidth}px 0 0 ${e.cursor.css} inset;}${this._terminalSelector} .${Le} .xterm-cursor.xterm-cursor-underline { border-bottom: 1px ${e.cursor.css}; border-bottom-style: solid; height: calc(100% - 1px);}`, i += `${this._terminalSelector} .${Xr} { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}${this._terminalSelector}.focus .${Xr} div { position: absolute; background-color: ${e.selectionBackgroundOpaque.css};}${this._terminalSelector} .${Xr} div { position: absolute; background-color: ${e.selectionInactiveBackgroundOpaque.css};}`;
    for (let [l, a] of e.ansi.entries()) i += `${this._terminalSelector} .${jr}${l} { color: ${a.css}; }${this._terminalSelector} .${jr}${l}.xterm-dim { color: ${U.multiplyOpacity(a, 0.5).css}; }${this._terminalSelector} .${jo}${l} { background-color: ${a.css}; }`;
    i += `${this._terminalSelector} .${jr}${257} { color: ${U.opaque(e.background).css}; }${this._terminalSelector} .${jr}${257}.xterm-dim { color: ${U.multiplyOpacity(U.opaque(e.background), 0.5).css}; }${this._terminalSelector} .${jo}${257} { background-color: ${e.foreground.css}; }`, this._themeStyleElement.textContent = i;
  }
  _setDefaultSpacing() {
    let e = this.dimensions.css.cell.width - this._widthCache.get("W", false, false);
    this._rowContainer.style.letterSpacing = `${e}px`, this._rowFactory.defaultSpacing = e;
  }
  handleDevicePixelRatioChange() {
    this._updateDimensions(), this._widthCache.clear(), this._setDefaultSpacing();
  }
  _refreshRowElements(e, i) {
    for (let r = this._rowElements.length; r <= i; r++) {
      let n = this._document.createElement("div");
      this._rowContainer.appendChild(n), this._rowElements.push(n);
    }
    for (; this._rowElements.length > i; ) this._rowContainer.removeChild(this._rowElements.pop());
  }
  handleResize(e, i) {
    this._refreshRowElements(e, i), this._updateDimensions(), this.handleSelectionChanged(this._selectionRenderModel.selectionStart, this._selectionRenderModel.selectionEnd, this._selectionRenderModel.columnSelectMode);
  }
  handleCharSizeChanged() {
    this._updateDimensions(), this._widthCache.clear(), this._setDefaultSpacing();
  }
  handleBlur() {
    this._rowContainer.classList.remove(ki), this.renderRows(0, this._bufferService.rows - 1);
  }
  handleFocus() {
    this._rowContainer.classList.add(ki), this.renderRows(this._bufferService.buffer.y, this._bufferService.buffer.y);
  }
  handleSelectionChanged(e, i, r) {
    if (this._selectionContainer.replaceChildren(), this._rowFactory.handleSelectionChanged(e, i, r), this.renderRows(0, this._bufferService.rows - 1), !e || !i || (this._selectionRenderModel.update(this._terminal, e, i, r), !this._selectionRenderModel.hasSelection)) return;
    let n = this._selectionRenderModel.viewportStartRow, o2 = this._selectionRenderModel.viewportEndRow, l = this._selectionRenderModel.viewportCappedStartRow, a = this._selectionRenderModel.viewportCappedEndRow, u = this._document.createDocumentFragment();
    if (r) {
      let h2 = e[0] > i[0];
      u.appendChild(this._createSelectionElement(l, h2 ? i[0] : e[0], h2 ? e[0] : i[0], a - l + 1));
    } else {
      let h2 = n === l ? e[0] : 0, c = l === o2 ? i[0] : this._bufferService.cols;
      u.appendChild(this._createSelectionElement(l, h2, c));
      let d = a - l - 1;
      if (u.appendChild(this._createSelectionElement(l + 1, 0, this._bufferService.cols, d)), l !== a) {
        let _2 = o2 === a ? i[0] : this._bufferService.cols;
        u.appendChild(this._createSelectionElement(a, 0, _2));
      }
    }
    this._selectionContainer.appendChild(u);
  }
  _createSelectionElement(e, i, r, n = 1) {
    let o2 = this._document.createElement("div"), l = i * this.dimensions.css.cell.width, a = this.dimensions.css.cell.width * (r - i);
    return l + a > this.dimensions.css.canvas.width && (a = this.dimensions.css.canvas.width - l), o2.style.height = `${n * this.dimensions.css.cell.height}px`, o2.style.top = `${e * this.dimensions.css.cell.height}px`, o2.style.left = `${l}px`, o2.style.width = `${a}px`, o2;
  }
  handleCursorMove() {
  }
  _handleOptionsChanged() {
    this._updateDimensions(), this._injectCss(this._themeService.colors), this._widthCache.setFont(this._optionsService.rawOptions.fontFamily, this._optionsService.rawOptions.fontSize, this._optionsService.rawOptions.fontWeight, this._optionsService.rawOptions.fontWeightBold), this._setDefaultSpacing();
  }
  clear() {
    for (let e of this._rowElements) e.replaceChildren();
  }
  renderRows(e, i) {
    let r = this._bufferService.buffer, n = r.ybase + r.y, o2 = Math.min(r.x, this._bufferService.cols - 1), l = this._coreService.decPrivateModes.cursorBlink ?? this._optionsService.rawOptions.cursorBlink, a = this._coreService.decPrivateModes.cursorStyle ?? this._optionsService.rawOptions.cursorStyle, u = this._optionsService.rawOptions.cursorInactiveStyle;
    for (let h2 = e; h2 <= i; h2++) {
      let c = h2 + r.ydisp, d = this._rowElements[h2], _2 = r.lines.get(c);
      if (!d || !_2) break;
      d.replaceChildren(...this._rowFactory.createRow(_2, c, c === n, a, u, o2, l, this.dimensions.css.cell.width, this._widthCache, -1, -1));
    }
  }
  get _terminalSelector() {
    return `.${_s}${this._terminalClass}`;
  }
  _handleLinkHover(e) {
    this._setCellUnderline(e.x1, e.x2, e.y1, e.y2, e.cols, true);
  }
  _handleLinkLeave(e) {
    this._setCellUnderline(e.x1, e.x2, e.y1, e.y2, e.cols, false);
  }
  _setCellUnderline(e, i, r, n, o2, l) {
    r < 0 && (e = 0), n < 0 && (i = 0);
    let a = this._bufferService.rows - 1;
    r = Math.max(Math.min(r, a), 0), n = Math.max(Math.min(n, a), 0), o2 = Math.min(o2, this._bufferService.cols);
    let u = this._bufferService.buffer, h2 = u.ybase + u.y, c = Math.min(u.x, o2 - 1), d = this._optionsService.rawOptions.cursorBlink, _2 = this._optionsService.rawOptions.cursorStyle, p = this._optionsService.rawOptions.cursorInactiveStyle;
    for (let m = r; m <= n; ++m) {
      let f = m + u.ydisp, A = this._rowElements[m], R = u.lines.get(f);
      if (!A || !R) break;
      A.replaceChildren(...this._rowFactory.createRow(R, f, f === h2, _2, p, c, d, this.dimensions.css.cell.width, this._widthCache, l ? m === r ? e : 0 : -1, l ? (m === n ? i : o2) - 1 : -1));
    }
  }
};
Yt = M([S(7, xt), S(8, nt), S(9, H), S(10, F), S(11, ge), S(12, ae), S(13, Re)], Yt);
var jt = class extends D {
  constructor(e, i, r) {
    super();
    this._optionsService = r;
    this.width = 0;
    this.height = 0;
    this._onCharSizeChange = this._register(new v());
    this.onCharSizeChange = this._onCharSizeChange.event;
    try {
      this._measureStrategy = this._register(new vs(this._optionsService));
    } catch {
      this._measureStrategy = this._register(new bs(e, i, this._optionsService));
    }
    this._register(this._optionsService.onMultipleOptionChange(["fontFamily", "fontSize"], () => this.measure()));
  }
  get hasValidSize() {
    return this.width > 0 && this.height > 0;
  }
  measure() {
    let e = this._measureStrategy.measure();
    (e.width !== this.width || e.height !== this.height) && (this.width = e.width, this.height = e.height, this._onCharSizeChange.fire());
  }
};
jt = M([S(2, H)], jt);
var Zr = class extends D {
  constructor() {
    super(...arguments);
    this._result = { width: 0, height: 0 };
  }
  _validateAndSet(e, i) {
    e !== void 0 && e > 0 && i !== void 0 && i > 0 && (this._result.width = e, this._result.height = i);
  }
};
var bs = class extends Zr {
  constructor(e, i, r) {
    super();
    this._document = e;
    this._parentElement = i;
    this._optionsService = r;
    this._measureElement = this._document.createElement("span"), this._measureElement.classList.add("xterm-char-measure-element"), this._measureElement.textContent = "W".repeat(32), this._measureElement.setAttribute("aria-hidden", "true"), this._measureElement.style.whiteSpace = "pre", this._measureElement.style.fontKerning = "none", this._parentElement.appendChild(this._measureElement);
  }
  measure() {
    return this._measureElement.style.fontFamily = this._optionsService.rawOptions.fontFamily, this._measureElement.style.fontSize = `${this._optionsService.rawOptions.fontSize}px`, this._validateAndSet(Number(this._measureElement.offsetWidth) / 32, Number(this._measureElement.offsetHeight)), this._result;
  }
};
var vs = class extends Zr {
  constructor(e) {
    super();
    this._optionsService = e;
    this._canvas = new OffscreenCanvas(100, 100), this._ctx = this._canvas.getContext("2d");
    let i = this._ctx.measureText("W");
    if (!("width" in i && "fontBoundingBoxAscent" in i && "fontBoundingBoxDescent" in i)) throw new Error("Required font metrics not supported");
  }
  measure() {
    this._ctx.font = `${this._optionsService.rawOptions.fontSize}px ${this._optionsService.rawOptions.fontFamily}`;
    let e = this._ctx.measureText("W");
    return this._validateAndSet(e.width, e.fontBoundingBoxAscent + e.fontBoundingBoxDescent), this._result;
  }
};
var Jr = class extends D {
  constructor(e, i, r) {
    super();
    this._textarea = e;
    this._window = i;
    this.mainDocument = r;
    this._isFocused = false;
    this._cachedIsFocused = void 0;
    this._screenDprMonitor = this._register(new gs(this._window));
    this._onDprChange = this._register(new v());
    this.onDprChange = this._onDprChange.event;
    this._onWindowChange = this._register(new v());
    this.onWindowChange = this._onWindowChange.event;
    this._register(this.onWindowChange((n) => this._screenDprMonitor.setWindow(n))), this._register($.forward(this._screenDprMonitor.onDprChange, this._onDprChange)), this._register(L(this._textarea, "focus", () => this._isFocused = true)), this._register(L(this._textarea, "blur", () => this._isFocused = false));
  }
  get window() {
    return this._window;
  }
  set window(e) {
    this._window !== e && (this._window = e, this._onWindowChange.fire(this._window));
  }
  get dpr() {
    return this.window.devicePixelRatio;
  }
  get isFocused() {
    return this._cachedIsFocused === void 0 && (this._cachedIsFocused = this._isFocused && this._textarea.ownerDocument.hasFocus(), queueMicrotask(() => this._cachedIsFocused = void 0)), this._cachedIsFocused;
  }
};
var gs = class extends D {
  constructor(e) {
    super();
    this._parentWindow = e;
    this._windowResizeListener = this._register(new ye());
    this._onDprChange = this._register(new v());
    this.onDprChange = this._onDprChange.event;
    this._outerListener = () => this._setDprAndFireIfDiffers(), this._currentDevicePixelRatio = this._parentWindow.devicePixelRatio, this._updateDpr(), this._setWindowResizeListener(), this._register(C(() => this.clearListener()));
  }
  setWindow(e) {
    this._parentWindow = e, this._setWindowResizeListener(), this._setDprAndFireIfDiffers();
  }
  _setWindowResizeListener() {
    this._windowResizeListener.value = L(this._parentWindow, "resize", () => this._setDprAndFireIfDiffers());
  }
  _setDprAndFireIfDiffers() {
    this._parentWindow.devicePixelRatio !== this._currentDevicePixelRatio && this._onDprChange.fire(this._parentWindow.devicePixelRatio), this._updateDpr();
  }
  _updateDpr() {
    this._outerListener && (this._resolutionMediaMatchList?.removeListener(this._outerListener), this._currentDevicePixelRatio = this._parentWindow.devicePixelRatio, this._resolutionMediaMatchList = this._parentWindow.matchMedia(`screen and (resolution: ${this._parentWindow.devicePixelRatio}dppx)`), this._resolutionMediaMatchList.addListener(this._outerListener));
  }
  clearListener() {
    !this._resolutionMediaMatchList || !this._outerListener || (this._resolutionMediaMatchList.removeListener(this._outerListener), this._resolutionMediaMatchList = void 0, this._outerListener = void 0);
  }
};
var Qr = class extends D {
  constructor() {
    super();
    this.linkProviders = [];
    this._register(C(() => this.linkProviders.length = 0));
  }
  registerLinkProvider(e) {
    return this.linkProviders.push(e), { dispose: () => {
      let i = this.linkProviders.indexOf(e);
      i !== -1 && this.linkProviders.splice(i, 1);
    } };
  }
};
function Ci(s15, t2, e) {
  let i = e.getBoundingClientRect(), r = s15.getComputedStyle(e), n = parseInt(r.getPropertyValue("padding-left")), o2 = parseInt(r.getPropertyValue("padding-top"));
  return [t2.clientX - i.left - n, t2.clientY - i.top - o2];
}
function Xo(s15, t2, e, i, r, n, o2, l, a) {
  if (!n) return;
  let u = Ci(s15, t2, e);
  if (u) return u[0] = Math.ceil((u[0] + (a ? o2 / 2 : 0)) / o2), u[1] = Math.ceil(u[1] / l), u[0] = Math.min(Math.max(u[0], 1), i + (a ? 1 : 0)), u[1] = Math.min(Math.max(u[1], 1), r), u;
}
var Xt = class {
  constructor(t2, e) {
    this._renderService = t2;
    this._charSizeService = e;
  }
  getCoords(t2, e, i, r, n) {
    return Xo(window, t2, e, i, r, this._charSizeService.hasValidSize, this._renderService.dimensions.css.cell.width, this._renderService.dimensions.css.cell.height, n);
  }
  getMouseReportCoords(t2, e) {
    let i = Ci(window, t2, e);
    if (this._charSizeService.hasValidSize) return i[0] = Math.min(Math.max(i[0], 0), this._renderService.dimensions.css.canvas.width - 1), i[1] = Math.min(Math.max(i[1], 0), this._renderService.dimensions.css.canvas.height - 1), { col: Math.floor(i[0] / this._renderService.dimensions.css.cell.width), row: Math.floor(i[1] / this._renderService.dimensions.css.cell.height), x: Math.floor(i[0]), y: Math.floor(i[1]) };
  }
};
Xt = M([S(0, ce), S(1, nt)], Xt);
var en2 = class {
  constructor(t2, e) {
    this._renderCallback = t2;
    this._coreBrowserService = e;
    this._refreshCallbacks = [];
  }
  dispose() {
    this._animationFrame && (this._coreBrowserService.window.cancelAnimationFrame(this._animationFrame), this._animationFrame = void 0);
  }
  addRefreshCallback(t2) {
    return this._refreshCallbacks.push(t2), this._animationFrame || (this._animationFrame = this._coreBrowserService.window.requestAnimationFrame(() => this._innerRefresh())), this._animationFrame;
  }
  refresh(t2, e, i) {
    this._rowCount = i, t2 = t2 !== void 0 ? t2 : 0, e = e !== void 0 ? e : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, t2) : t2, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, e) : e, !this._animationFrame && (this._animationFrame = this._coreBrowserService.window.requestAnimationFrame(() => this._innerRefresh()));
  }
  _innerRefresh() {
    if (this._animationFrame = void 0, this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) {
      this._runRefreshCallbacks();
      return;
    }
    let t2 = Math.max(this._rowStart, 0), e = Math.min(this._rowEnd, this._rowCount - 1);
    this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(t2, e), this._runRefreshCallbacks();
  }
  _runRefreshCallbacks() {
    for (let t2 of this._refreshCallbacks) t2(0);
    this._refreshCallbacks = [];
  }
};
var tn = {};
Ll(tn, { getSafariVersion: () => Ha, isChromeOS: () => Ts, isFirefox: () => Ss, isIpad: () => Wa, isIphone: () => Ua, isLegacyEdge: () => Fa, isLinux: () => Bi, isMac: () => Zt, isNode: () => Mi, isSafari: () => Zo, isWindows: () => Es });
var Mi = typeof process < "u" && "title" in process;
var Pi = Mi ? "node" : navigator.userAgent;
var Oi = Mi ? "node" : navigator.platform;
var Ss = Pi.includes("Firefox");
var Fa = Pi.includes("Edge");
var Zo = /^((?!chrome|android).)*safari/i.test(Pi);
function Ha() {
  if (!Zo) return 0;
  let s15 = Pi.match(/Version\/(\d+)/);
  return s15 === null || s15.length < 2 ? 0 : parseInt(s15[1]);
}
var Zt = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].includes(Oi);
var Wa = Oi === "iPad";
var Ua = Oi === "iPhone";
var Es = ["Windows", "Win16", "Win32", "WinCE"].includes(Oi);
var Bi = Oi.indexOf("Linux") >= 0;
var Ts = /\bCrOS\b/.test(Pi);
var rn = class {
  constructor() {
    this._tasks = [];
    this._i = 0;
  }
  enqueue(t2) {
    this._tasks.push(t2), this._start();
  }
  flush() {
    for (; this._i < this._tasks.length; ) this._tasks[this._i]() || this._i++;
    this.clear();
  }
  clear() {
    this._idleCallback && (this._cancelCallback(this._idleCallback), this._idleCallback = void 0), this._i = 0, this._tasks.length = 0;
  }
  _start() {
    this._idleCallback || (this._idleCallback = this._requestCallback(this._process.bind(this)));
  }
  _process(t2) {
    this._idleCallback = void 0;
    let e = 0, i = 0, r = t2.timeRemaining(), n = 0;
    for (; this._i < this._tasks.length; ) {
      if (e = performance.now(), this._tasks[this._i]() || this._i++, e = Math.max(1, performance.now() - e), i = Math.max(e, i), n = t2.timeRemaining(), i * 1.5 > n) {
        r - e < -20 && console.warn(`task queue exceeded allotted deadline by ${Math.abs(Math.round(r - e))}ms`), this._start();
        return;
      }
      r = n;
    }
    this.clear();
  }
};
var Is = class extends rn {
  _requestCallback(t2) {
    return setTimeout(() => t2(this._createDeadline(16)));
  }
  _cancelCallback(t2) {
    clearTimeout(t2);
  }
  _createDeadline(t2) {
    let e = performance.now() + t2;
    return { timeRemaining: () => Math.max(0, e - performance.now()) };
  }
};
var ys = class extends rn {
  _requestCallback(t2) {
    return requestIdleCallback(t2);
  }
  _cancelCallback(t2) {
    cancelIdleCallback(t2);
  }
};
var Jt = !Mi && "requestIdleCallback" in window ? ys : Is;
var nn = class {
  constructor() {
    this._queue = new Jt();
  }
  set(t2) {
    this._queue.clear(), this._queue.enqueue(t2);
  }
  flush() {
    this._queue.flush();
  }
};
var Qt = class extends D {
  constructor(e, i, r, n, o2, l, a, u, h2) {
    super();
    this._rowCount = e;
    this._optionsService = r;
    this._charSizeService = n;
    this._coreService = o2;
    this._coreBrowserService = u;
    this._renderer = this._register(new ye());
    this._pausedResizeTask = new nn();
    this._observerDisposable = this._register(new ye());
    this._isPaused = false;
    this._needsFullRefresh = false;
    this._isNextRenderRedrawOnly = true;
    this._needsSelectionRefresh = false;
    this._canvasWidth = 0;
    this._canvasHeight = 0;
    this._selectionState = { start: void 0, end: void 0, columnSelectMode: false };
    this._onDimensionsChange = this._register(new v());
    this.onDimensionsChange = this._onDimensionsChange.event;
    this._onRenderedViewportChange = this._register(new v());
    this.onRenderedViewportChange = this._onRenderedViewportChange.event;
    this._onRender = this._register(new v());
    this.onRender = this._onRender.event;
    this._onRefreshRequest = this._register(new v());
    this.onRefreshRequest = this._onRefreshRequest.event;
    this._renderDebouncer = new en2((c, d) => this._renderRows(c, d), this._coreBrowserService), this._register(this._renderDebouncer), this._syncOutputHandler = new xs(this._coreBrowserService, this._coreService, () => this._fullRefresh()), this._register(C(() => this._syncOutputHandler.dispose())), this._register(this._coreBrowserService.onDprChange(() => this.handleDevicePixelRatioChange())), this._register(a.onResize(() => this._fullRefresh())), this._register(a.buffers.onBufferActivate(() => this._renderer.value?.clear())), this._register(this._optionsService.onOptionChange(() => this._handleOptionsChanged())), this._register(this._charSizeService.onCharSizeChange(() => this.handleCharSizeChanged())), this._register(l.onDecorationRegistered(() => this._fullRefresh())), this._register(l.onDecorationRemoved(() => this._fullRefresh())), this._register(this._optionsService.onMultipleOptionChange(["customGlyphs", "drawBoldTextInBrightColors", "letterSpacing", "lineHeight", "fontFamily", "fontSize", "fontWeight", "fontWeightBold", "minimumContrastRatio", "rescaleOverlappingGlyphs"], () => {
      this.clear(), this.handleResize(a.cols, a.rows), this._fullRefresh();
    })), this._register(this._optionsService.onMultipleOptionChange(["cursorBlink", "cursorStyle"], () => this.refreshRows(a.buffer.y, a.buffer.y, true))), this._register(h2.onChangeColors(() => this._fullRefresh())), this._registerIntersectionObserver(this._coreBrowserService.window, i), this._register(this._coreBrowserService.onWindowChange((c) => this._registerIntersectionObserver(c, i)));
  }
  get dimensions() {
    return this._renderer.value.dimensions;
  }
  _registerIntersectionObserver(e, i) {
    if ("IntersectionObserver" in e) {
      let r = new e.IntersectionObserver((n) => this._handleIntersectionChange(n[n.length - 1]), { threshold: 0 });
      r.observe(i), this._observerDisposable.value = C(() => r.disconnect());
    }
  }
  _handleIntersectionChange(e) {
    this._isPaused = e.isIntersecting === void 0 ? e.intersectionRatio === 0 : !e.isIntersecting, !this._isPaused && !this._charSizeService.hasValidSize && this._charSizeService.measure(), !this._isPaused && this._needsFullRefresh && (this._pausedResizeTask.flush(), this.refreshRows(0, this._rowCount - 1), this._needsFullRefresh = false);
  }
  refreshRows(e, i, r = false) {
    if (this._isPaused) {
      this._needsFullRefresh = true;
      return;
    }
    if (this._coreService.decPrivateModes.synchronizedOutput) {
      this._syncOutputHandler.bufferRows(e, i);
      return;
    }
    let n = this._syncOutputHandler.flush();
    n && (e = Math.min(e, n.start), i = Math.max(i, n.end)), r || (this._isNextRenderRedrawOnly = false), this._renderDebouncer.refresh(e, i, this._rowCount);
  }
  _renderRows(e, i) {
    if (this._renderer.value) {
      if (this._coreService.decPrivateModes.synchronizedOutput) {
        this._syncOutputHandler.bufferRows(e, i);
        return;
      }
      e = Math.min(e, this._rowCount - 1), i = Math.min(i, this._rowCount - 1), this._renderer.value.renderRows(e, i), this._needsSelectionRefresh && (this._renderer.value.handleSelectionChanged(this._selectionState.start, this._selectionState.end, this._selectionState.columnSelectMode), this._needsSelectionRefresh = false), this._isNextRenderRedrawOnly || this._onRenderedViewportChange.fire({ start: e, end: i }), this._onRender.fire({ start: e, end: i }), this._isNextRenderRedrawOnly = true;
    }
  }
  resize(e, i) {
    this._rowCount = i, this._fireOnCanvasResize();
  }
  _handleOptionsChanged() {
    this._renderer.value && (this.refreshRows(0, this._rowCount - 1), this._fireOnCanvasResize());
  }
  _fireOnCanvasResize() {
    this._renderer.value && (this._renderer.value.dimensions.css.canvas.width === this._canvasWidth && this._renderer.value.dimensions.css.canvas.height === this._canvasHeight || this._onDimensionsChange.fire(this._renderer.value.dimensions));
  }
  hasRenderer() {
    return !!this._renderer.value;
  }
  setRenderer(e) {
    this._renderer.value = e, this._renderer.value && (this._renderer.value.onRequestRedraw((i) => this.refreshRows(i.start, i.end, true)), this._needsSelectionRefresh = true, this._fullRefresh());
  }
  addRefreshCallback(e) {
    return this._renderDebouncer.addRefreshCallback(e);
  }
  _fullRefresh() {
    this._isPaused ? this._needsFullRefresh = true : this.refreshRows(0, this._rowCount - 1);
  }
  clearTextureAtlas() {
    this._renderer.value && (this._renderer.value.clearTextureAtlas?.(), this._fullRefresh());
  }
  handleDevicePixelRatioChange() {
    this._charSizeService.measure(), this._renderer.value && (this._renderer.value.handleDevicePixelRatioChange(), this.refreshRows(0, this._rowCount - 1));
  }
  handleResize(e, i) {
    this._renderer.value && (this._isPaused ? this._pausedResizeTask.set(() => this._renderer.value?.handleResize(e, i)) : this._renderer.value.handleResize(e, i), this._fullRefresh());
  }
  handleCharSizeChanged() {
    this._renderer.value?.handleCharSizeChanged();
  }
  handleBlur() {
    this._renderer.value?.handleBlur();
  }
  handleFocus() {
    this._renderer.value?.handleFocus();
  }
  handleSelectionChanged(e, i, r) {
    this._selectionState.start = e, this._selectionState.end = i, this._selectionState.columnSelectMode = r, this._renderer.value?.handleSelectionChanged(e, i, r);
  }
  handleCursorMove() {
    this._renderer.value?.handleCursorMove();
  }
  clear() {
    this._renderer.value?.clear();
  }
};
Qt = M([S(2, H), S(3, nt), S(4, ge), S(5, Be), S(6, F), S(7, ae), S(8, Re)], Qt);
var xs = class {
  constructor(t2, e, i) {
    this._coreBrowserService = t2;
    this._coreService = e;
    this._onTimeout = i;
    this._start = 0;
    this._end = 0;
    this._isBuffering = false;
  }
  bufferRows(t2, e) {
    this._isBuffering ? (this._start = Math.min(this._start, t2), this._end = Math.max(this._end, e)) : (this._start = t2, this._end = e, this._isBuffering = true), this._timeout === void 0 && (this._timeout = this._coreBrowserService.window.setTimeout(() => {
      this._timeout = void 0, this._coreService.decPrivateModes.synchronizedOutput = false, this._onTimeout();
    }, 1e3));
  }
  flush() {
    if (this._timeout !== void 0 && (this._coreBrowserService.window.clearTimeout(this._timeout), this._timeout = void 0), !this._isBuffering) return;
    let t2 = { start: this._start, end: this._end };
    return this._isBuffering = false, t2;
  }
  dispose() {
    this._timeout !== void 0 && (this._coreBrowserService.window.clearTimeout(this._timeout), this._timeout = void 0);
  }
};
function Jo(s15, t2, e, i) {
  let r = e.buffer.x, n = e.buffer.y;
  if (!e.buffer.hasScrollback) return Ga(r, n, s15, t2, e, i) + sn(n, t2, e, i) + $a(r, n, s15, t2, e, i);
  let o2;
  if (n === t2) return o2 = r > s15 ? "D" : "C", Fi(Math.abs(r - s15), Ni(o2, i));
  o2 = n > t2 ? "D" : "C";
  let l = Math.abs(n - t2), a = za(n > t2 ? s15 : r, e) + (l - 1) * e.cols + 1 + Ka(n > t2 ? r : s15, e);
  return Fi(a, Ni(o2, i));
}
function Ka(s15, t2) {
  return s15 - 1;
}
function za(s15, t2) {
  return t2.cols - s15;
}
function Ga(s15, t2, e, i, r, n) {
  return sn(t2, i, r, n).length === 0 ? "" : Fi(el(s15, t2, s15, t2 - gt(t2, r), false, r).length, Ni("D", n));
}
function sn(s15, t2, e, i) {
  let r = s15 - gt(s15, e), n = t2 - gt(t2, e), o2 = Math.abs(r - n) - Va(s15, t2, e);
  return Fi(o2, Ni(Qo(s15, t2), i));
}
function $a(s15, t2, e, i, r, n) {
  let o2;
  sn(t2, i, r, n).length > 0 ? o2 = i - gt(i, r) : o2 = t2;
  let l = i, a = qa(s15, t2, e, i, r, n);
  return Fi(el(s15, o2, e, l, a === "C", r).length, Ni(a, n));
}
function Va(s15, t2, e) {
  let i = 0, r = s15 - gt(s15, e), n = t2 - gt(t2, e);
  for (let o2 = 0; o2 < Math.abs(r - n); o2++) {
    let l = Qo(s15, t2) === "A" ? -1 : 1;
    e.buffer.lines.get(r + l * o2)?.isWrapped && i++;
  }
  return i;
}
function gt(s15, t2) {
  let e = 0, i = t2.buffer.lines.get(s15), r = i?.isWrapped;
  for (; r && s15 >= 0 && s15 < t2.rows; ) e++, i = t2.buffer.lines.get(--s15), r = i?.isWrapped;
  return e;
}
function qa(s15, t2, e, i, r, n) {
  let o2;
  return sn(e, i, r, n).length > 0 ? o2 = i - gt(i, r) : o2 = t2, s15 < e && o2 <= i || s15 >= e && o2 < i ? "C" : "D";
}
function Qo(s15, t2) {
  return s15 > t2 ? "A" : "B";
}
function el(s15, t2, e, i, r, n) {
  let o2 = s15, l = t2, a = "";
  for (; (o2 !== e || l !== i) && l >= 0 && l < n.buffer.lines.length; ) o2 += r ? 1 : -1, r && o2 > n.cols - 1 ? (a += n.buffer.translateBufferLineToString(l, false, s15, o2), o2 = 0, s15 = 0, l++) : !r && o2 < 0 && (a += n.buffer.translateBufferLineToString(l, false, 0, s15 + 1), o2 = n.cols - 1, s15 = o2, l--);
  return a + n.buffer.translateBufferLineToString(l, false, s15, o2);
}
function Ni(s15, t2) {
  let e = t2 ? "O" : "[";
  return b.ESC + e + s15;
}
function Fi(s15, t2) {
  s15 = Math.floor(s15);
  let e = "";
  for (let i = 0; i < s15; i++) e += t2;
  return e;
}
var on = class {
  constructor(t2) {
    this._bufferService = t2;
    this.isSelectAllActive = false;
    this.selectionStartLength = 0;
  }
  clearSelection() {
    this.selectionStart = void 0, this.selectionEnd = void 0, this.isSelectAllActive = false, this.selectionStartLength = 0;
  }
  get finalSelectionStart() {
    return this.isSelectAllActive ? [0, 0] : !this.selectionEnd || !this.selectionStart ? this.selectionStart : this.areSelectionValuesReversed() ? this.selectionEnd : this.selectionStart;
  }
  get finalSelectionEnd() {
    if (this.isSelectAllActive) return [this._bufferService.cols, this._bufferService.buffer.ybase + this._bufferService.rows - 1];
    if (this.selectionStart) {
      if (!this.selectionEnd || this.areSelectionValuesReversed()) {
        let t2 = this.selectionStart[0] + this.selectionStartLength;
        return t2 > this._bufferService.cols ? t2 % this._bufferService.cols === 0 ? [this._bufferService.cols, this.selectionStart[1] + Math.floor(t2 / this._bufferService.cols) - 1] : [t2 % this._bufferService.cols, this.selectionStart[1] + Math.floor(t2 / this._bufferService.cols)] : [t2, this.selectionStart[1]];
      }
      if (this.selectionStartLength && this.selectionEnd[1] === this.selectionStart[1]) {
        let t2 = this.selectionStart[0] + this.selectionStartLength;
        return t2 > this._bufferService.cols ? [t2 % this._bufferService.cols, this.selectionStart[1] + Math.floor(t2 / this._bufferService.cols)] : [Math.max(t2, this.selectionEnd[0]), this.selectionEnd[1]];
      }
      return this.selectionEnd;
    }
  }
  areSelectionValuesReversed() {
    let t2 = this.selectionStart, e = this.selectionEnd;
    return !t2 || !e ? false : t2[1] > e[1] || t2[1] === e[1] && t2[0] > e[0];
  }
  handleTrim(t2) {
    return this.selectionStart && (this.selectionStart[1] -= t2), this.selectionEnd && (this.selectionEnd[1] -= t2), this.selectionEnd && this.selectionEnd[1] < 0 ? (this.clearSelection(), true) : (this.selectionStart && this.selectionStart[1] < 0 && (this.selectionStart[1] = 0), false);
  }
};
function ws(s15, t2) {
  if (s15.start.y > s15.end.y) throw new Error(`Buffer range end (${s15.end.x}, ${s15.end.y}) cannot be before start (${s15.start.x}, ${s15.start.y})`);
  return t2 * (s15.end.y - s15.start.y) + (s15.end.x - s15.start.x + 1);
}
var Ds = 50;
var Ya = 15;
var ja = 50;
var Xa = 500;
var Za = "\xA0";
var Ja = new RegExp(Za, "g");
var ei = class extends D {
  constructor(e, i, r, n, o2, l, a, u, h2) {
    super();
    this._element = e;
    this._screenElement = i;
    this._linkifier = r;
    this._bufferService = n;
    this._coreService = o2;
    this._mouseService = l;
    this._optionsService = a;
    this._renderService = u;
    this._coreBrowserService = h2;
    this._dragScrollAmount = 0;
    this._enabled = true;
    this._workCell = new q();
    this._mouseDownTimeStamp = 0;
    this._oldHasSelection = false;
    this._oldSelectionStart = void 0;
    this._oldSelectionEnd = void 0;
    this._onLinuxMouseSelection = this._register(new v());
    this.onLinuxMouseSelection = this._onLinuxMouseSelection.event;
    this._onRedrawRequest = this._register(new v());
    this.onRequestRedraw = this._onRedrawRequest.event;
    this._onSelectionChange = this._register(new v());
    this.onSelectionChange = this._onSelectionChange.event;
    this._onRequestScrollLines = this._register(new v());
    this.onRequestScrollLines = this._onRequestScrollLines.event;
    this._mouseMoveListener = (c) => this._handleMouseMove(c), this._mouseUpListener = (c) => this._handleMouseUp(c), this._coreService.onUserInput(() => {
      this.hasSelection && this.clearSelection();
    }), this._trimListener = this._bufferService.buffer.lines.onTrim((c) => this._handleTrim(c)), this._register(this._bufferService.buffers.onBufferActivate((c) => this._handleBufferActivate(c))), this.enable(), this._model = new on(this._bufferService), this._activeSelectionMode = 0, this._register(C(() => {
      this._removeMouseDownListeners();
    })), this._register(this._bufferService.onResize((c) => {
      c.rowsChanged && this.clearSelection();
    }));
  }
  reset() {
    this.clearSelection();
  }
  disable() {
    this.clearSelection(), this._enabled = false;
  }
  enable() {
    this._enabled = true;
  }
  get selectionStart() {
    return this._model.finalSelectionStart;
  }
  get selectionEnd() {
    return this._model.finalSelectionEnd;
  }
  get hasSelection() {
    let e = this._model.finalSelectionStart, i = this._model.finalSelectionEnd;
    return !e || !i ? false : e[0] !== i[0] || e[1] !== i[1];
  }
  get selectionText() {
    let e = this._model.finalSelectionStart, i = this._model.finalSelectionEnd;
    if (!e || !i) return "";
    let r = this._bufferService.buffer, n = [];
    if (this._activeSelectionMode === 3) {
      if (e[0] === i[0]) return "";
      let l = e[0] < i[0] ? e[0] : i[0], a = e[0] < i[0] ? i[0] : e[0];
      for (let u = e[1]; u <= i[1]; u++) {
        let h2 = r.translateBufferLineToString(u, true, l, a);
        n.push(h2);
      }
    } else {
      let l = e[1] === i[1] ? i[0] : void 0;
      n.push(r.translateBufferLineToString(e[1], true, e[0], l));
      for (let a = e[1] + 1; a <= i[1] - 1; a++) {
        let u = r.lines.get(a), h2 = r.translateBufferLineToString(a, true);
        u?.isWrapped ? n[n.length - 1] += h2 : n.push(h2);
      }
      if (e[1] !== i[1]) {
        let a = r.lines.get(i[1]), u = r.translateBufferLineToString(i[1], true, 0, i[0]);
        a && a.isWrapped ? n[n.length - 1] += u : n.push(u);
      }
    }
    return n.map((l) => l.replace(Ja, " ")).join(Es ? `\r
` : `
`);
  }
  clearSelection() {
    this._model.clearSelection(), this._removeMouseDownListeners(), this.refresh(), this._onSelectionChange.fire();
  }
  refresh(e) {
    this._refreshAnimationFrame || (this._refreshAnimationFrame = this._coreBrowserService.window.requestAnimationFrame(() => this._refresh())), Bi && e && this.selectionText.length && this._onLinuxMouseSelection.fire(this.selectionText);
  }
  _refresh() {
    this._refreshAnimationFrame = void 0, this._onRedrawRequest.fire({ start: this._model.finalSelectionStart, end: this._model.finalSelectionEnd, columnSelectMode: this._activeSelectionMode === 3 });
  }
  _isClickInSelection(e) {
    let i = this._getMouseBufferCoords(e), r = this._model.finalSelectionStart, n = this._model.finalSelectionEnd;
    return !r || !n || !i ? false : this._areCoordsInSelection(i, r, n);
  }
  isCellInSelection(e, i) {
    let r = this._model.finalSelectionStart, n = this._model.finalSelectionEnd;
    return !r || !n ? false : this._areCoordsInSelection([e, i], r, n);
  }
  _areCoordsInSelection(e, i, r) {
    return e[1] > i[1] && e[1] < r[1] || i[1] === r[1] && e[1] === i[1] && e[0] >= i[0] && e[0] < r[0] || i[1] < r[1] && e[1] === r[1] && e[0] < r[0] || i[1] < r[1] && e[1] === i[1] && e[0] >= i[0];
  }
  _selectWordAtCursor(e, i) {
    let r = this._linkifier.currentLink?.link?.range;
    if (r) return this._model.selectionStart = [r.start.x - 1, r.start.y - 1], this._model.selectionStartLength = ws(r, this._bufferService.cols), this._model.selectionEnd = void 0, true;
    let n = this._getMouseBufferCoords(e);
    return n ? (this._selectWordAt(n, i), this._model.selectionEnd = void 0, true) : false;
  }
  selectAll() {
    this._model.isSelectAllActive = true, this.refresh(), this._onSelectionChange.fire();
  }
  selectLines(e, i) {
    this._model.clearSelection(), e = Math.max(e, 0), i = Math.min(i, this._bufferService.buffer.lines.length - 1), this._model.selectionStart = [0, e], this._model.selectionEnd = [this._bufferService.cols, i], this.refresh(), this._onSelectionChange.fire();
  }
  _handleTrim(e) {
    this._model.handleTrim(e) && this.refresh();
  }
  _getMouseBufferCoords(e) {
    let i = this._mouseService.getCoords(e, this._screenElement, this._bufferService.cols, this._bufferService.rows, true);
    if (i) return i[0]--, i[1]--, i[1] += this._bufferService.buffer.ydisp, i;
  }
  _getMouseEventScrollAmount(e) {
    let i = Ci(this._coreBrowserService.window, e, this._screenElement)[1], r = this._renderService.dimensions.css.canvas.height;
    return i >= 0 && i <= r ? 0 : (i > r && (i -= r), i = Math.min(Math.max(i, -Ds), Ds), i /= Ds, i / Math.abs(i) + Math.round(i * (Ya - 1)));
  }
  shouldForceSelection(e) {
    return Zt ? e.altKey && this._optionsService.rawOptions.macOptionClickForcesSelection : e.shiftKey;
  }
  handleMouseDown(e) {
    if (this._mouseDownTimeStamp = e.timeStamp, !(e.button === 2 && this.hasSelection) && e.button === 0) {
      if (!this._enabled) {
        if (!this.shouldForceSelection(e)) return;
        e.stopPropagation();
      }
      e.preventDefault(), this._dragScrollAmount = 0, this._enabled && e.shiftKey ? this._handleIncrementalClick(e) : e.detail === 1 ? this._handleSingleClick(e) : e.detail === 2 ? this._handleDoubleClick(e) : e.detail === 3 && this._handleTripleClick(e), this._addMouseDownListeners(), this.refresh(true);
    }
  }
  _addMouseDownListeners() {
    this._screenElement.ownerDocument && (this._screenElement.ownerDocument.addEventListener("mousemove", this._mouseMoveListener), this._screenElement.ownerDocument.addEventListener("mouseup", this._mouseUpListener)), this._dragScrollIntervalTimer = this._coreBrowserService.window.setInterval(() => this._dragScroll(), ja);
  }
  _removeMouseDownListeners() {
    this._screenElement.ownerDocument && (this._screenElement.ownerDocument.removeEventListener("mousemove", this._mouseMoveListener), this._screenElement.ownerDocument.removeEventListener("mouseup", this._mouseUpListener)), this._coreBrowserService.window.clearInterval(this._dragScrollIntervalTimer), this._dragScrollIntervalTimer = void 0;
  }
  _handleIncrementalClick(e) {
    this._model.selectionStart && (this._model.selectionEnd = this._getMouseBufferCoords(e));
  }
  _handleSingleClick(e) {
    if (this._model.selectionStartLength = 0, this._model.isSelectAllActive = false, this._activeSelectionMode = this.shouldColumnSelect(e) ? 3 : 0, this._model.selectionStart = this._getMouseBufferCoords(e), !this._model.selectionStart) return;
    this._model.selectionEnd = void 0;
    let i = this._bufferService.buffer.lines.get(this._model.selectionStart[1]);
    i && i.length !== this._model.selectionStart[0] && i.hasWidth(this._model.selectionStart[0]) === 0 && this._model.selectionStart[0]++;
  }
  _handleDoubleClick(e) {
    this._selectWordAtCursor(e, true) && (this._activeSelectionMode = 1);
  }
  _handleTripleClick(e) {
    let i = this._getMouseBufferCoords(e);
    i && (this._activeSelectionMode = 2, this._selectLineAt(i[1]));
  }
  shouldColumnSelect(e) {
    return e.altKey && !(Zt && this._optionsService.rawOptions.macOptionClickForcesSelection);
  }
  _handleMouseMove(e) {
    if (e.stopImmediatePropagation(), !this._model.selectionStart) return;
    let i = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
    if (this._model.selectionEnd = this._getMouseBufferCoords(e), !this._model.selectionEnd) {
      this.refresh(true);
      return;
    }
    this._activeSelectionMode === 2 ? this._model.selectionEnd[1] < this._model.selectionStart[1] ? this._model.selectionEnd[0] = 0 : this._model.selectionEnd[0] = this._bufferService.cols : this._activeSelectionMode === 1 && this._selectToWordAt(this._model.selectionEnd), this._dragScrollAmount = this._getMouseEventScrollAmount(e), this._activeSelectionMode !== 3 && (this._dragScrollAmount > 0 ? this._model.selectionEnd[0] = this._bufferService.cols : this._dragScrollAmount < 0 && (this._model.selectionEnd[0] = 0));
    let r = this._bufferService.buffer;
    if (this._model.selectionEnd[1] < r.lines.length) {
      let n = r.lines.get(this._model.selectionEnd[1]);
      n && n.hasWidth(this._model.selectionEnd[0]) === 0 && this._model.selectionEnd[0] < this._bufferService.cols && this._model.selectionEnd[0]++;
    }
    (!i || i[0] !== this._model.selectionEnd[0] || i[1] !== this._model.selectionEnd[1]) && this.refresh(true);
  }
  _dragScroll() {
    if (!(!this._model.selectionEnd || !this._model.selectionStart) && this._dragScrollAmount) {
      this._onRequestScrollLines.fire({ amount: this._dragScrollAmount, suppressScrollEvent: false });
      let e = this._bufferService.buffer;
      this._dragScrollAmount > 0 ? (this._activeSelectionMode !== 3 && (this._model.selectionEnd[0] = this._bufferService.cols), this._model.selectionEnd[1] = Math.min(e.ydisp + this._bufferService.rows, e.lines.length - 1)) : (this._activeSelectionMode !== 3 && (this._model.selectionEnd[0] = 0), this._model.selectionEnd[1] = e.ydisp), this.refresh();
    }
  }
  _handleMouseUp(e) {
    let i = e.timeStamp - this._mouseDownTimeStamp;
    if (this._removeMouseDownListeners(), this.selectionText.length <= 1 && i < Xa && e.altKey && this._optionsService.rawOptions.altClickMovesCursor) {
      if (this._bufferService.buffer.ybase === this._bufferService.buffer.ydisp) {
        let r = this._mouseService.getCoords(e, this._element, this._bufferService.cols, this._bufferService.rows, false);
        if (r && r[0] !== void 0 && r[1] !== void 0) {
          let n = Jo(r[0] - 1, r[1] - 1, this._bufferService, this._coreService.decPrivateModes.applicationCursorKeys);
          this._coreService.triggerDataEvent(n, true);
        }
      }
    } else this._fireEventIfSelectionChanged();
  }
  _fireEventIfSelectionChanged() {
    let e = this._model.finalSelectionStart, i = this._model.finalSelectionEnd, r = !!e && !!i && (e[0] !== i[0] || e[1] !== i[1]);
    if (!r) {
      this._oldHasSelection && this._fireOnSelectionChange(e, i, r);
      return;
    }
    !e || !i || (!this._oldSelectionStart || !this._oldSelectionEnd || e[0] !== this._oldSelectionStart[0] || e[1] !== this._oldSelectionStart[1] || i[0] !== this._oldSelectionEnd[0] || i[1] !== this._oldSelectionEnd[1]) && this._fireOnSelectionChange(e, i, r);
  }
  _fireOnSelectionChange(e, i, r) {
    this._oldSelectionStart = e, this._oldSelectionEnd = i, this._oldHasSelection = r, this._onSelectionChange.fire();
  }
  _handleBufferActivate(e) {
    this.clearSelection(), this._trimListener.dispose(), this._trimListener = e.activeBuffer.lines.onTrim((i) => this._handleTrim(i));
  }
  _convertViewportColToCharacterIndex(e, i) {
    let r = i;
    for (let n = 0; i >= n; n++) {
      let o2 = e.loadCell(n, this._workCell).getChars().length;
      this._workCell.getWidth() === 0 ? r-- : o2 > 1 && i !== n && (r += o2 - 1);
    }
    return r;
  }
  setSelection(e, i, r) {
    this._model.clearSelection(), this._removeMouseDownListeners(), this._model.selectionStart = [e, i], this._model.selectionStartLength = r, this.refresh(), this._fireEventIfSelectionChanged();
  }
  rightClickSelect(e) {
    this._isClickInSelection(e) || (this._selectWordAtCursor(e, false) && this.refresh(true), this._fireEventIfSelectionChanged());
  }
  _getWordAt(e, i, r = true, n = true) {
    if (e[0] >= this._bufferService.cols) return;
    let o2 = this._bufferService.buffer, l = o2.lines.get(e[1]);
    if (!l) return;
    let a = o2.translateBufferLineToString(e[1], false), u = this._convertViewportColToCharacterIndex(l, e[0]), h2 = u, c = e[0] - u, d = 0, _2 = 0, p = 0, m = 0;
    if (a.charAt(u) === " ") {
      for (; u > 0 && a.charAt(u - 1) === " "; ) u--;
      for (; h2 < a.length && a.charAt(h2 + 1) === " "; ) h2++;
    } else {
      let R = e[0], O = e[0];
      l.getWidth(R) === 0 && (d++, R--), l.getWidth(O) === 2 && (_2++, O++);
      let I = l.getString(O).length;
      for (I > 1 && (m += I - 1, h2 += I - 1); R > 0 && u > 0 && !this._isCharWordSeparator(l.loadCell(R - 1, this._workCell)); ) {
        l.loadCell(R - 1, this._workCell);
        let k = this._workCell.getChars().length;
        this._workCell.getWidth() === 0 ? (d++, R--) : k > 1 && (p += k - 1, u -= k - 1), u--, R--;
      }
      for (; O < l.length && h2 + 1 < a.length && !this._isCharWordSeparator(l.loadCell(O + 1, this._workCell)); ) {
        l.loadCell(O + 1, this._workCell);
        let k = this._workCell.getChars().length;
        this._workCell.getWidth() === 2 ? (_2++, O++) : k > 1 && (m += k - 1, h2 += k - 1), h2++, O++;
      }
    }
    h2++;
    let f = u + c - d + p, A = Math.min(this._bufferService.cols, h2 - u + d + _2 - p - m);
    if (!(!i && a.slice(u, h2).trim() === "")) {
      if (r && f === 0 && l.getCodePoint(0) !== 32) {
        let R = o2.lines.get(e[1] - 1);
        if (R && l.isWrapped && R.getCodePoint(this._bufferService.cols - 1) !== 32) {
          let O = this._getWordAt([this._bufferService.cols - 1, e[1] - 1], false, true, false);
          if (O) {
            let I = this._bufferService.cols - O.start;
            f -= I, A += I;
          }
        }
      }
      if (n && f + A === this._bufferService.cols && l.getCodePoint(this._bufferService.cols - 1) !== 32) {
        let R = o2.lines.get(e[1] + 1);
        if (R?.isWrapped && R.getCodePoint(0) !== 32) {
          let O = this._getWordAt([0, e[1] + 1], false, false, true);
          O && (A += O.length);
        }
      }
      return { start: f, length: A };
    }
  }
  _selectWordAt(e, i) {
    let r = this._getWordAt(e, i);
    if (r) {
      for (; r.start < 0; ) r.start += this._bufferService.cols, e[1]--;
      this._model.selectionStart = [r.start, e[1]], this._model.selectionStartLength = r.length;
    }
  }
  _selectToWordAt(e) {
    let i = this._getWordAt(e, true);
    if (i) {
      let r = e[1];
      for (; i.start < 0; ) i.start += this._bufferService.cols, r--;
      if (!this._model.areSelectionValuesReversed()) for (; i.start + i.length > this._bufferService.cols; ) i.length -= this._bufferService.cols, r++;
      this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? i.start : i.start + i.length, r];
    }
  }
  _isCharWordSeparator(e) {
    return e.getWidth() === 0 ? false : this._optionsService.rawOptions.wordSeparator.indexOf(e.getChars()) >= 0;
  }
  _selectLineAt(e) {
    let i = this._bufferService.buffer.getWrappedRangeForLine(e), r = { start: { x: 0, y: i.first }, end: { x: this._bufferService.cols - 1, y: i.last } };
    this._model.selectionStart = [0, i.first], this._model.selectionEnd = void 0, this._model.selectionStartLength = ws(r, this._bufferService.cols);
  }
};
ei = M([S(3, F), S(4, ge), S(5, Dt), S(6, H), S(7, ce), S(8, ae)], ei);
var Hi = class {
  constructor() {
    this._data = {};
  }
  set(t2, e, i) {
    this._data[t2] || (this._data[t2] = {}), this._data[t2][e] = i;
  }
  get(t2, e) {
    return this._data[t2] ? this._data[t2][e] : void 0;
  }
  clear() {
    this._data = {};
  }
};
var Wi = class {
  constructor() {
    this._color = new Hi();
    this._css = new Hi();
  }
  setCss(t2, e, i) {
    this._css.set(t2, e, i);
  }
  getCss(t2, e) {
    return this._css.get(t2, e);
  }
  setColor(t2, e, i) {
    this._color.set(t2, e, i);
  }
  getColor(t2, e) {
    return this._color.get(t2, e);
  }
  clear() {
    this._color.clear(), this._css.clear();
  }
};
var re = Object.freeze((() => {
  let s15 = [z.toColor("#2e3436"), z.toColor("#cc0000"), z.toColor("#4e9a06"), z.toColor("#c4a000"), z.toColor("#3465a4"), z.toColor("#75507b"), z.toColor("#06989a"), z.toColor("#d3d7cf"), z.toColor("#555753"), z.toColor("#ef2929"), z.toColor("#8ae234"), z.toColor("#fce94f"), z.toColor("#729fcf"), z.toColor("#ad7fa8"), z.toColor("#34e2e2"), z.toColor("#eeeeec")], t2 = [0, 95, 135, 175, 215, 255];
  for (let e = 0; e < 216; e++) {
    let i = t2[e / 36 % 6 | 0], r = t2[e / 6 % 6 | 0], n = t2[e % 6];
    s15.push({ css: j.toCss(i, r, n), rgba: j.toRgba(i, r, n) });
  }
  for (let e = 0; e < 24; e++) {
    let i = 8 + e * 10;
    s15.push({ css: j.toCss(i, i, i), rgba: j.toRgba(i, i, i) });
  }
  return s15;
})());
var St = z.toColor("#ffffff");
var Ki = z.toColor("#000000");
var tl = z.toColor("#ffffff");
var il = Ki;
var Ui = { css: "rgba(255, 255, 255, 0.3)", rgba: 4294967117 };
var Qa = St;
var ti = class extends D {
  constructor(e) {
    super();
    this._optionsService = e;
    this._contrastCache = new Wi();
    this._halfContrastCache = new Wi();
    this._onChangeColors = this._register(new v());
    this.onChangeColors = this._onChangeColors.event;
    this._colors = { foreground: St, background: Ki, cursor: tl, cursorAccent: il, selectionForeground: void 0, selectionBackgroundTransparent: Ui, selectionBackgroundOpaque: U.blend(Ki, Ui), selectionInactiveBackgroundTransparent: Ui, selectionInactiveBackgroundOpaque: U.blend(Ki, Ui), scrollbarSliderBackground: U.opacity(St, 0.2), scrollbarSliderHoverBackground: U.opacity(St, 0.4), scrollbarSliderActiveBackground: U.opacity(St, 0.5), overviewRulerBorder: St, ansi: re.slice(), contrastCache: this._contrastCache, halfContrastCache: this._halfContrastCache }, this._updateRestoreColors(), this._setTheme(this._optionsService.rawOptions.theme), this._register(this._optionsService.onSpecificOptionChange("minimumContrastRatio", () => this._contrastCache.clear())), this._register(this._optionsService.onSpecificOptionChange("theme", () => this._setTheme(this._optionsService.rawOptions.theme)));
  }
  get colors() {
    return this._colors;
  }
  _setTheme(e = {}) {
    let i = this._colors;
    if (i.foreground = K(e.foreground, St), i.background = K(e.background, Ki), i.cursor = U.blend(i.background, K(e.cursor, tl)), i.cursorAccent = U.blend(i.background, K(e.cursorAccent, il)), i.selectionBackgroundTransparent = K(e.selectionBackground, Ui), i.selectionBackgroundOpaque = U.blend(i.background, i.selectionBackgroundTransparent), i.selectionInactiveBackgroundTransparent = K(e.selectionInactiveBackground, i.selectionBackgroundTransparent), i.selectionInactiveBackgroundOpaque = U.blend(i.background, i.selectionInactiveBackgroundTransparent), i.selectionForeground = e.selectionForeground ? K(e.selectionForeground, ps) : void 0, i.selectionForeground === ps && (i.selectionForeground = void 0), U.isOpaque(i.selectionBackgroundTransparent) && (i.selectionBackgroundTransparent = U.opacity(i.selectionBackgroundTransparent, 0.3)), U.isOpaque(i.selectionInactiveBackgroundTransparent) && (i.selectionInactiveBackgroundTransparent = U.opacity(i.selectionInactiveBackgroundTransparent, 0.3)), i.scrollbarSliderBackground = K(e.scrollbarSliderBackground, U.opacity(i.foreground, 0.2)), i.scrollbarSliderHoverBackground = K(e.scrollbarSliderHoverBackground, U.opacity(i.foreground, 0.4)), i.scrollbarSliderActiveBackground = K(e.scrollbarSliderActiveBackground, U.opacity(i.foreground, 0.5)), i.overviewRulerBorder = K(e.overviewRulerBorder, Qa), i.ansi = re.slice(), i.ansi[0] = K(e.black, re[0]), i.ansi[1] = K(e.red, re[1]), i.ansi[2] = K(e.green, re[2]), i.ansi[3] = K(e.yellow, re[3]), i.ansi[4] = K(e.blue, re[4]), i.ansi[5] = K(e.magenta, re[5]), i.ansi[6] = K(e.cyan, re[6]), i.ansi[7] = K(e.white, re[7]), i.ansi[8] = K(e.brightBlack, re[8]), i.ansi[9] = K(e.brightRed, re[9]), i.ansi[10] = K(e.brightGreen, re[10]), i.ansi[11] = K(e.brightYellow, re[11]), i.ansi[12] = K(e.brightBlue, re[12]), i.ansi[13] = K(e.brightMagenta, re[13]), i.ansi[14] = K(e.brightCyan, re[14]), i.ansi[15] = K(e.brightWhite, re[15]), e.extendedAnsi) {
      let r = Math.min(i.ansi.length - 16, e.extendedAnsi.length);
      for (let n = 0; n < r; n++) i.ansi[n + 16] = K(e.extendedAnsi[n], re[n + 16]);
    }
    this._contrastCache.clear(), this._halfContrastCache.clear(), this._updateRestoreColors(), this._onChangeColors.fire(this.colors);
  }
  restoreColor(e) {
    this._restoreColor(e), this._onChangeColors.fire(this.colors);
  }
  _restoreColor(e) {
    if (e === void 0) {
      for (let i = 0; i < this._restoreColors.ansi.length; ++i) this._colors.ansi[i] = this._restoreColors.ansi[i];
      return;
    }
    switch (e) {
      case 256:
        this._colors.foreground = this._restoreColors.foreground;
        break;
      case 257:
        this._colors.background = this._restoreColors.background;
        break;
      case 258:
        this._colors.cursor = this._restoreColors.cursor;
        break;
      default:
        this._colors.ansi[e] = this._restoreColors.ansi[e];
    }
  }
  modifyColors(e) {
    e(this._colors), this._onChangeColors.fire(this.colors);
  }
  _updateRestoreColors() {
    this._restoreColors = { foreground: this._colors.foreground, background: this._colors.background, cursor: this._colors.cursor, ansi: this._colors.ansi.slice() };
  }
};
ti = M([S(0, H)], ti);
function K(s15, t2) {
  if (s15 !== void 0) try {
    return z.toColor(s15);
  } catch {
  }
  return t2;
}
var Rs = class {
  constructor(...t2) {
    this._entries = /* @__PURE__ */ new Map();
    for (let [e, i] of t2) this.set(e, i);
  }
  set(t2, e) {
    let i = this._entries.get(t2);
    return this._entries.set(t2, e), i;
  }
  forEach(t2) {
    for (let [e, i] of this._entries.entries()) t2(e, i);
  }
  has(t2) {
    return this._entries.has(t2);
  }
  get(t2) {
    return this._entries.get(t2);
  }
};
var ln = class {
  constructor() {
    this._services = new Rs();
    this._services.set(xt, this);
  }
  setService(t2, e) {
    this._services.set(t2, e);
  }
  getService(t2) {
    return this._services.get(t2);
  }
  createInstance(t2, ...e) {
    let i = Xs(t2).sort((o2, l) => o2.index - l.index), r = [];
    for (let o2 of i) {
      let l = this._services.get(o2.id);
      if (!l) throw new Error(`[createInstance] ${t2.name} depends on UNKNOWN service ${o2.id._id}.`);
      r.push(l);
    }
    let n = i.length > 0 ? i[0].index : e.length;
    if (e.length !== n) throw new Error(`[createInstance] First service dependency of ${t2.name} at position ${n + 1} conflicts with ${e.length} static arguments`);
    return new t2(...e, ...r);
  }
};
var ec = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, off: 5 };
var tc = "xterm.js: ";
var ii = class extends D {
  constructor(e) {
    super();
    this._optionsService = e;
    this._logLevel = 5;
    this._updateLogLevel(), this._register(this._optionsService.onSpecificOptionChange("logLevel", () => this._updateLogLevel())), ic = this;
  }
  get logLevel() {
    return this._logLevel;
  }
  _updateLogLevel() {
    this._logLevel = ec[this._optionsService.rawOptions.logLevel];
  }
  _evalLazyOptionalParams(e) {
    for (let i = 0; i < e.length; i++) typeof e[i] == "function" && (e[i] = e[i]());
  }
  _log(e, i, r) {
    this._evalLazyOptionalParams(r), e.call(console, (this._optionsService.options.logger ? "" : tc) + i, ...r);
  }
  trace(e, ...i) {
    this._logLevel <= 0 && this._log(this._optionsService.options.logger?.trace.bind(this._optionsService.options.logger) ?? console.log, e, i);
  }
  debug(e, ...i) {
    this._logLevel <= 1 && this._log(this._optionsService.options.logger?.debug.bind(this._optionsService.options.logger) ?? console.log, e, i);
  }
  info(e, ...i) {
    this._logLevel <= 2 && this._log(this._optionsService.options.logger?.info.bind(this._optionsService.options.logger) ?? console.info, e, i);
  }
  warn(e, ...i) {
    this._logLevel <= 3 && this._log(this._optionsService.options.logger?.warn.bind(this._optionsService.options.logger) ?? console.warn, e, i);
  }
  error(e, ...i) {
    this._logLevel <= 4 && this._log(this._optionsService.options.logger?.error.bind(this._optionsService.options.logger) ?? console.error, e, i);
  }
};
ii = M([S(0, H)], ii);
var ic;
var zi = class extends D {
  constructor(e) {
    super();
    this._maxLength = e;
    this.onDeleteEmitter = this._register(new v());
    this.onDelete = this.onDeleteEmitter.event;
    this.onInsertEmitter = this._register(new v());
    this.onInsert = this.onInsertEmitter.event;
    this.onTrimEmitter = this._register(new v());
    this.onTrim = this.onTrimEmitter.event;
    this._array = new Array(this._maxLength), this._startIndex = 0, this._length = 0;
  }
  get maxLength() {
    return this._maxLength;
  }
  set maxLength(e) {
    if (this._maxLength === e) return;
    let i = new Array(e);
    for (let r = 0; r < Math.min(e, this.length); r++) i[r] = this._array[this._getCyclicIndex(r)];
    this._array = i, this._maxLength = e, this._startIndex = 0;
  }
  get length() {
    return this._length;
  }
  set length(e) {
    if (e > this._length) for (let i = this._length; i < e; i++) this._array[i] = void 0;
    this._length = e;
  }
  get(e) {
    return this._array[this._getCyclicIndex(e)];
  }
  set(e, i) {
    this._array[this._getCyclicIndex(e)] = i;
  }
  push(e) {
    this._array[this._getCyclicIndex(this._length)] = e, this._length === this._maxLength ? (this._startIndex = ++this._startIndex % this._maxLength, this.onTrimEmitter.fire(1)) : this._length++;
  }
  recycle() {
    if (this._length !== this._maxLength) throw new Error("Can only recycle when the buffer is full");
    return this._startIndex = ++this._startIndex % this._maxLength, this.onTrimEmitter.fire(1), this._array[this._getCyclicIndex(this._length - 1)];
  }
  get isFull() {
    return this._length === this._maxLength;
  }
  pop() {
    return this._array[this._getCyclicIndex(this._length-- - 1)];
  }
  splice(e, i, ...r) {
    if (i) {
      for (let n = e; n < this._length - i; n++) this._array[this._getCyclicIndex(n)] = this._array[this._getCyclicIndex(n + i)];
      this._length -= i, this.onDeleteEmitter.fire({ index: e, amount: i });
    }
    for (let n = this._length - 1; n >= e; n--) this._array[this._getCyclicIndex(n + r.length)] = this._array[this._getCyclicIndex(n)];
    for (let n = 0; n < r.length; n++) this._array[this._getCyclicIndex(e + n)] = r[n];
    if (r.length && this.onInsertEmitter.fire({ index: e, amount: r.length }), this._length + r.length > this._maxLength) {
      let n = this._length + r.length - this._maxLength;
      this._startIndex += n, this._length = this._maxLength, this.onTrimEmitter.fire(n);
    } else this._length += r.length;
  }
  trimStart(e) {
    e > this._length && (e = this._length), this._startIndex += e, this._length -= e, this.onTrimEmitter.fire(e);
  }
  shiftElements(e, i, r) {
    if (!(i <= 0)) {
      if (e < 0 || e >= this._length) throw new Error("start argument out of range");
      if (e + r < 0) throw new Error("Cannot shift elements in list beyond index 0");
      if (r > 0) {
        for (let o2 = i - 1; o2 >= 0; o2--) this.set(e + o2 + r, this.get(e + o2));
        let n = e + i + r - this._length;
        if (n > 0) for (this._length += n; this._length > this._maxLength; ) this._length--, this._startIndex++, this.onTrimEmitter.fire(1);
      } else for (let n = 0; n < i; n++) this.set(e + n + r, this.get(e + n));
    }
  }
  _getCyclicIndex(e) {
    return (this._startIndex + e) % this._maxLength;
  }
};
var B = 3;
var X = Object.freeze(new De());
var an = 0;
var Ls = 2;
var Ze = class s12 {
  constructor(t2, e, i = false) {
    this.isWrapped = i;
    this._combined = {};
    this._extendedAttrs = {};
    this._data = new Uint32Array(t2 * B);
    let r = e || q.fromCharData([0, ir, 1, 0]);
    for (let n = 0; n < t2; ++n) this.setCell(n, r);
    this.length = t2;
  }
  get(t2) {
    let e = this._data[t2 * B + 0], i = e & 2097151;
    return [this._data[t2 * B + 1], e & 2097152 ? this._combined[t2] : i ? Ce(i) : "", e >> 22, e & 2097152 ? this._combined[t2].charCodeAt(this._combined[t2].length - 1) : i];
  }
  set(t2, e) {
    this._data[t2 * B + 1] = e[0], e[1].length > 1 ? (this._combined[t2] = e[1], this._data[t2 * B + 0] = t2 | 2097152 | e[2] << 22) : this._data[t2 * B + 0] = e[1].charCodeAt(0) | e[2] << 22;
  }
  getWidth(t2) {
    return this._data[t2 * B + 0] >> 22;
  }
  hasWidth(t2) {
    return this._data[t2 * B + 0] & 12582912;
  }
  getFg(t2) {
    return this._data[t2 * B + 1];
  }
  getBg(t2) {
    return this._data[t2 * B + 2];
  }
  hasContent(t2) {
    return this._data[t2 * B + 0] & 4194303;
  }
  getCodePoint(t2) {
    let e = this._data[t2 * B + 0];
    return e & 2097152 ? this._combined[t2].charCodeAt(this._combined[t2].length - 1) : e & 2097151;
  }
  isCombined(t2) {
    return this._data[t2 * B + 0] & 2097152;
  }
  getString(t2) {
    let e = this._data[t2 * B + 0];
    return e & 2097152 ? this._combined[t2] : e & 2097151 ? Ce(e & 2097151) : "";
  }
  isProtected(t2) {
    return this._data[t2 * B + 2] & 536870912;
  }
  loadCell(t2, e) {
    return an = t2 * B, e.content = this._data[an + 0], e.fg = this._data[an + 1], e.bg = this._data[an + 2], e.content & 2097152 && (e.combinedData = this._combined[t2]), e.bg & 268435456 && (e.extended = this._extendedAttrs[t2]), e;
  }
  setCell(t2, e) {
    e.content & 2097152 && (this._combined[t2] = e.combinedData), e.bg & 268435456 && (this._extendedAttrs[t2] = e.extended), this._data[t2 * B + 0] = e.content, this._data[t2 * B + 1] = e.fg, this._data[t2 * B + 2] = e.bg;
  }
  setCellFromCodepoint(t2, e, i, r) {
    r.bg & 268435456 && (this._extendedAttrs[t2] = r.extended), this._data[t2 * B + 0] = e | i << 22, this._data[t2 * B + 1] = r.fg, this._data[t2 * B + 2] = r.bg;
  }
  addCodepointToCell(t2, e, i) {
    let r = this._data[t2 * B + 0];
    r & 2097152 ? this._combined[t2] += Ce(e) : r & 2097151 ? (this._combined[t2] = Ce(r & 2097151) + Ce(e), r &= -2097152, r |= 2097152) : r = e | 1 << 22, i && (r &= -12582913, r |= i << 22), this._data[t2 * B + 0] = r;
  }
  insertCells(t2, e, i) {
    if (t2 %= this.length, t2 && this.getWidth(t2 - 1) === 2 && this.setCellFromCodepoint(t2 - 1, 0, 1, i), e < this.length - t2) {
      let r = new q();
      for (let n = this.length - t2 - e - 1; n >= 0; --n) this.setCell(t2 + e + n, this.loadCell(t2 + n, r));
      for (let n = 0; n < e; ++n) this.setCell(t2 + n, i);
    } else for (let r = t2; r < this.length; ++r) this.setCell(r, i);
    this.getWidth(this.length - 1) === 2 && this.setCellFromCodepoint(this.length - 1, 0, 1, i);
  }
  deleteCells(t2, e, i) {
    if (t2 %= this.length, e < this.length - t2) {
      let r = new q();
      for (let n = 0; n < this.length - t2 - e; ++n) this.setCell(t2 + n, this.loadCell(t2 + e + n, r));
      for (let n = this.length - e; n < this.length; ++n) this.setCell(n, i);
    } else for (let r = t2; r < this.length; ++r) this.setCell(r, i);
    t2 && this.getWidth(t2 - 1) === 2 && this.setCellFromCodepoint(t2 - 1, 0, 1, i), this.getWidth(t2) === 0 && !this.hasContent(t2) && this.setCellFromCodepoint(t2, 0, 1, i);
  }
  replaceCells(t2, e, i, r = false) {
    if (r) {
      for (t2 && this.getWidth(t2 - 1) === 2 && !this.isProtected(t2 - 1) && this.setCellFromCodepoint(t2 - 1, 0, 1, i), e < this.length && this.getWidth(e - 1) === 2 && !this.isProtected(e) && this.setCellFromCodepoint(e, 0, 1, i); t2 < e && t2 < this.length; ) this.isProtected(t2) || this.setCell(t2, i), t2++;
      return;
    }
    for (t2 && this.getWidth(t2 - 1) === 2 && this.setCellFromCodepoint(t2 - 1, 0, 1, i), e < this.length && this.getWidth(e - 1) === 2 && this.setCellFromCodepoint(e, 0, 1, i); t2 < e && t2 < this.length; ) this.setCell(t2++, i);
  }
  resize(t2, e) {
    if (t2 === this.length) return this._data.length * 4 * Ls < this._data.buffer.byteLength;
    let i = t2 * B;
    if (t2 > this.length) {
      if (this._data.buffer.byteLength >= i * 4) this._data = new Uint32Array(this._data.buffer, 0, i);
      else {
        let r = new Uint32Array(i);
        r.set(this._data), this._data = r;
      }
      for (let r = this.length; r < t2; ++r) this.setCell(r, e);
    } else {
      this._data = this._data.subarray(0, i);
      let r = Object.keys(this._combined);
      for (let o2 = 0; o2 < r.length; o2++) {
        let l = parseInt(r[o2], 10);
        l >= t2 && delete this._combined[l];
      }
      let n = Object.keys(this._extendedAttrs);
      for (let o2 = 0; o2 < n.length; o2++) {
        let l = parseInt(n[o2], 10);
        l >= t2 && delete this._extendedAttrs[l];
      }
    }
    return this.length = t2, i * 4 * Ls < this._data.buffer.byteLength;
  }
  cleanupMemory() {
    if (this._data.length * 4 * Ls < this._data.buffer.byteLength) {
      let t2 = new Uint32Array(this._data.length);
      return t2.set(this._data), this._data = t2, 1;
    }
    return 0;
  }
  fill(t2, e = false) {
    if (e) {
      for (let i = 0; i < this.length; ++i) this.isProtected(i) || this.setCell(i, t2);
      return;
    }
    this._combined = {}, this._extendedAttrs = {};
    for (let i = 0; i < this.length; ++i) this.setCell(i, t2);
  }
  copyFrom(t2) {
    this.length !== t2.length ? this._data = new Uint32Array(t2._data) : this._data.set(t2._data), this.length = t2.length, this._combined = {};
    for (let e in t2._combined) this._combined[e] = t2._combined[e];
    this._extendedAttrs = {};
    for (let e in t2._extendedAttrs) this._extendedAttrs[e] = t2._extendedAttrs[e];
    this.isWrapped = t2.isWrapped;
  }
  clone() {
    let t2 = new s12(0);
    t2._data = new Uint32Array(this._data), t2.length = this.length;
    for (let e in this._combined) t2._combined[e] = this._combined[e];
    for (let e in this._extendedAttrs) t2._extendedAttrs[e] = this._extendedAttrs[e];
    return t2.isWrapped = this.isWrapped, t2;
  }
  getTrimmedLength() {
    for (let t2 = this.length - 1; t2 >= 0; --t2) if (this._data[t2 * B + 0] & 4194303) return t2 + (this._data[t2 * B + 0] >> 22);
    return 0;
  }
  getNoBgTrimmedLength() {
    for (let t2 = this.length - 1; t2 >= 0; --t2) if (this._data[t2 * B + 0] & 4194303 || this._data[t2 * B + 2] & 50331648) return t2 + (this._data[t2 * B + 0] >> 22);
    return 0;
  }
  copyCellsFrom(t2, e, i, r, n) {
    let o2 = t2._data;
    if (n) for (let a = r - 1; a >= 0; a--) {
      for (let u = 0; u < B; u++) this._data[(i + a) * B + u] = o2[(e + a) * B + u];
      o2[(e + a) * B + 2] & 268435456 && (this._extendedAttrs[i + a] = t2._extendedAttrs[e + a]);
    }
    else for (let a = 0; a < r; a++) {
      for (let u = 0; u < B; u++) this._data[(i + a) * B + u] = o2[(e + a) * B + u];
      o2[(e + a) * B + 2] & 268435456 && (this._extendedAttrs[i + a] = t2._extendedAttrs[e + a]);
    }
    let l = Object.keys(t2._combined);
    for (let a = 0; a < l.length; a++) {
      let u = parseInt(l[a], 10);
      u >= e && (this._combined[u - e + i] = t2._combined[u]);
    }
  }
  translateToString(t2, e, i, r) {
    e = e ?? 0, i = i ?? this.length, t2 && (i = Math.min(i, this.getTrimmedLength())), r && (r.length = 0);
    let n = "";
    for (; e < i; ) {
      let o2 = this._data[e * B + 0], l = o2 & 2097151, a = o2 & 2097152 ? this._combined[e] : l ? Ce(l) : we;
      if (n += a, r) for (let u = 0; u < a.length; ++u) r.push(e);
      e += o2 >> 22 || 1;
    }
    return r && r.push(e), n;
  }
};
function sl(s15, t2, e, i, r, n) {
  let o2 = [];
  for (let l = 0; l < s15.length - 1; l++) {
    let a = l, u = s15.get(++a);
    if (!u.isWrapped) continue;
    let h2 = [s15.get(l)];
    for (; a < s15.length && u.isWrapped; ) h2.push(u), u = s15.get(++a);
    if (!n && i >= l && i < a) {
      l += h2.length - 1;
      continue;
    }
    let c = 0, d = ri(h2, c, t2), _2 = 1, p = 0;
    for (; _2 < h2.length; ) {
      let f = ri(h2, _2, t2), A = f - p, R = e - d, O = Math.min(A, R);
      h2[c].copyCellsFrom(h2[_2], p, d, O, false), d += O, d === e && (c++, d = 0), p += O, p === f && (_2++, p = 0), d === 0 && c !== 0 && h2[c - 1].getWidth(e - 1) === 2 && (h2[c].copyCellsFrom(h2[c - 1], e - 1, d++, 1, false), h2[c - 1].setCell(e - 1, r));
    }
    h2[c].replaceCells(d, e, r);
    let m = 0;
    for (let f = h2.length - 1; f > 0 && (f > c || h2[f].getTrimmedLength() === 0); f--) m++;
    m > 0 && (o2.push(l + h2.length - m), o2.push(m)), l += h2.length - 1;
  }
  return o2;
}
function ol(s15, t2) {
  let e = [], i = 0, r = t2[i], n = 0;
  for (let o2 = 0; o2 < s15.length; o2++) if (r === o2) {
    let l = t2[++i];
    s15.onDeleteEmitter.fire({ index: o2 - n, amount: l }), o2 += l - 1, n += l, r = t2[++i];
  } else e.push(o2);
  return { layout: e, countRemoved: n };
}
function ll(s15, t2) {
  let e = [];
  for (let i = 0; i < t2.length; i++) e.push(s15.get(t2[i]));
  for (let i = 0; i < e.length; i++) s15.set(i, e[i]);
  s15.length = t2.length;
}
function al(s15, t2, e) {
  let i = [], r = s15.map((a, u) => ri(s15, u, t2)).reduce((a, u) => a + u), n = 0, o2 = 0, l = 0;
  for (; l < r; ) {
    if (r - l < e) {
      i.push(r - l);
      break;
    }
    n += e;
    let a = ri(s15, o2, t2);
    n > a && (n -= a, o2++);
    let u = s15[o2].getWidth(n - 1) === 2;
    u && n--;
    let h2 = u ? e - 1 : e;
    i.push(h2), l += h2;
  }
  return i;
}
function ri(s15, t2, e) {
  if (t2 === s15.length - 1) return s15[t2].getTrimmedLength();
  let i = !s15[t2].hasContent(e - 1) && s15[t2].getWidth(e - 1) === 1, r = s15[t2 + 1].getWidth(0) === 2;
  return i && r ? e - 1 : e;
}
var un = class un2 {
  constructor(t2) {
    this.line = t2;
    this.isDisposed = false;
    this._disposables = [];
    this._id = un2._nextId++;
    this._onDispose = this.register(new v());
    this.onDispose = this._onDispose.event;
  }
  get id() {
    return this._id;
  }
  dispose() {
    this.isDisposed || (this.isDisposed = true, this.line = -1, this._onDispose.fire(), Ne(this._disposables), this._disposables.length = 0);
  }
  register(t2) {
    return this._disposables.push(t2), t2;
  }
};
un._nextId = 1;
var cn = un;
var ne = {};
var Je = ne.B;
ne[0] = { "`": "\u25C6", a: "\u2592", b: "\u2409", c: "\u240C", d: "\u240D", e: "\u240A", f: "\xB0", g: "\xB1", h: "\u2424", i: "\u240B", j: "\u2518", k: "\u2510", l: "\u250C", m: "\u2514", n: "\u253C", o: "\u23BA", p: "\u23BB", q: "\u2500", r: "\u23BC", s: "\u23BD", t: "\u251C", u: "\u2524", v: "\u2534", w: "\u252C", x: "\u2502", y: "\u2264", z: "\u2265", "{": "\u03C0", "|": "\u2260", "}": "\xA3", "~": "\xB7" };
ne.A = { "#": "\xA3" };
ne.B = void 0;
ne[4] = { "#": "\xA3", "@": "\xBE", "[": "ij", "\\": "\xBD", "]": "|", "{": "\xA8", "|": "f", "}": "\xBC", "~": "\xB4" };
ne.C = ne[5] = { "[": "\xC4", "\\": "\xD6", "]": "\xC5", "^": "\xDC", "`": "\xE9", "{": "\xE4", "|": "\xF6", "}": "\xE5", "~": "\xFC" };
ne.R = { "#": "\xA3", "@": "\xE0", "[": "\xB0", "\\": "\xE7", "]": "\xA7", "{": "\xE9", "|": "\xF9", "}": "\xE8", "~": "\xA8" };
ne.Q = { "@": "\xE0", "[": "\xE2", "\\": "\xE7", "]": "\xEA", "^": "\xEE", "`": "\xF4", "{": "\xE9", "|": "\xF9", "}": "\xE8", "~": "\xFB" };
ne.K = { "@": "\xA7", "[": "\xC4", "\\": "\xD6", "]": "\xDC", "{": "\xE4", "|": "\xF6", "}": "\xFC", "~": "\xDF" };
ne.Y = { "#": "\xA3", "@": "\xA7", "[": "\xB0", "\\": "\xE7", "]": "\xE9", "`": "\xF9", "{": "\xE0", "|": "\xF2", "}": "\xE8", "~": "\xEC" };
ne.E = ne[6] = { "@": "\xC4", "[": "\xC6", "\\": "\xD8", "]": "\xC5", "^": "\xDC", "`": "\xE4", "{": "\xE6", "|": "\xF8", "}": "\xE5", "~": "\xFC" };
ne.Z = { "#": "\xA3", "@": "\xA7", "[": "\xA1", "\\": "\xD1", "]": "\xBF", "{": "\xB0", "|": "\xF1", "}": "\xE7" };
ne.H = ne[7] = { "@": "\xC9", "[": "\xC4", "\\": "\xD6", "]": "\xC5", "^": "\xDC", "`": "\xE9", "{": "\xE4", "|": "\xF6", "}": "\xE5", "~": "\xFC" };
ne["="] = { "#": "\xF9", "@": "\xE0", "[": "\xE9", "\\": "\xE7", "]": "\xEA", "^": "\xEE", _: "\xE8", "`": "\xF4", "{": "\xE4", "|": "\xF6", "}": "\xFC", "~": "\xFB" };
var cl = 4294967295;
var $i = class {
  constructor(t2, e, i) {
    this._hasScrollback = t2;
    this._optionsService = e;
    this._bufferService = i;
    this.ydisp = 0;
    this.ybase = 0;
    this.y = 0;
    this.x = 0;
    this.tabs = {};
    this.savedY = 0;
    this.savedX = 0;
    this.savedCurAttrData = X.clone();
    this.savedCharset = Je;
    this.markers = [];
    this._nullCell = q.fromCharData([0, ir, 1, 0]);
    this._whitespaceCell = q.fromCharData([0, we, 1, 32]);
    this._isClearing = false;
    this._memoryCleanupQueue = new Jt();
    this._memoryCleanupPosition = 0;
    this._cols = this._bufferService.cols, this._rows = this._bufferService.rows, this.lines = new zi(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
  }
  getNullCell(t2) {
    return t2 ? (this._nullCell.fg = t2.fg, this._nullCell.bg = t2.bg, this._nullCell.extended = t2.extended) : (this._nullCell.fg = 0, this._nullCell.bg = 0, this._nullCell.extended = new rt()), this._nullCell;
  }
  getWhitespaceCell(t2) {
    return t2 ? (this._whitespaceCell.fg = t2.fg, this._whitespaceCell.bg = t2.bg, this._whitespaceCell.extended = t2.extended) : (this._whitespaceCell.fg = 0, this._whitespaceCell.bg = 0, this._whitespaceCell.extended = new rt()), this._whitespaceCell;
  }
  getBlankLine(t2, e) {
    return new Ze(this._bufferService.cols, this.getNullCell(t2), e);
  }
  get hasScrollback() {
    return this._hasScrollback && this.lines.maxLength > this._rows;
  }
  get isCursorInViewport() {
    let e = this.ybase + this.y - this.ydisp;
    return e >= 0 && e < this._rows;
  }
  _getCorrectBufferLength(t2) {
    if (!this._hasScrollback) return t2;
    let e = t2 + this._optionsService.rawOptions.scrollback;
    return e > cl ? cl : e;
  }
  fillViewportRows(t2) {
    if (this.lines.length === 0) {
      t2 === void 0 && (t2 = X);
      let e = this._rows;
      for (; e--; ) this.lines.push(this.getBlankLine(t2));
    }
  }
  clear() {
    this.ydisp = 0, this.ybase = 0, this.y = 0, this.x = 0, this.lines = new zi(this._getCorrectBufferLength(this._rows)), this.scrollTop = 0, this.scrollBottom = this._rows - 1, this.setupTabStops();
  }
  resize(t2, e) {
    let i = this.getNullCell(X), r = 0, n = this._getCorrectBufferLength(e);
    if (n > this.lines.maxLength && (this.lines.maxLength = n), this.lines.length > 0) {
      if (this._cols < t2) for (let l = 0; l < this.lines.length; l++) r += +this.lines.get(l).resize(t2, i);
      let o2 = 0;
      if (this._rows < e) for (let l = this._rows; l < e; l++) this.lines.length < e + this.ybase && (this._optionsService.rawOptions.windowsMode || this._optionsService.rawOptions.windowsPty.backend !== void 0 || this._optionsService.rawOptions.windowsPty.buildNumber !== void 0 ? this.lines.push(new Ze(t2, i)) : this.ybase > 0 && this.lines.length <= this.ybase + this.y + o2 + 1 ? (this.ybase--, o2++, this.ydisp > 0 && this.ydisp--) : this.lines.push(new Ze(t2, i)));
      else for (let l = this._rows; l > e; l--) this.lines.length > e + this.ybase && (this.lines.length > this.ybase + this.y + 1 ? this.lines.pop() : (this.ybase++, this.ydisp++));
      if (n < this.lines.maxLength) {
        let l = this.lines.length - n;
        l > 0 && (this.lines.trimStart(l), this.ybase = Math.max(this.ybase - l, 0), this.ydisp = Math.max(this.ydisp - l, 0), this.savedY = Math.max(this.savedY - l, 0)), this.lines.maxLength = n;
      }
      this.x = Math.min(this.x, t2 - 1), this.y = Math.min(this.y, e - 1), o2 && (this.y += o2), this.savedX = Math.min(this.savedX, t2 - 1), this.scrollTop = 0;
    }
    if (this.scrollBottom = e - 1, this._isReflowEnabled && (this._reflow(t2, e), this._cols > t2)) for (let o2 = 0; o2 < this.lines.length; o2++) r += +this.lines.get(o2).resize(t2, i);
    this._cols = t2, this._rows = e, this._memoryCleanupQueue.clear(), r > 0.1 * this.lines.length && (this._memoryCleanupPosition = 0, this._memoryCleanupQueue.enqueue(() => this._batchedMemoryCleanup()));
  }
  _batchedMemoryCleanup() {
    let t2 = true;
    this._memoryCleanupPosition >= this.lines.length && (this._memoryCleanupPosition = 0, t2 = false);
    let e = 0;
    for (; this._memoryCleanupPosition < this.lines.length; ) if (e += this.lines.get(this._memoryCleanupPosition++).cleanupMemory(), e > 100) return true;
    return t2;
  }
  get _isReflowEnabled() {
    let t2 = this._optionsService.rawOptions.windowsPty;
    return t2 && t2.buildNumber ? this._hasScrollback && t2.backend === "conpty" && t2.buildNumber >= 21376 : this._hasScrollback && !this._optionsService.rawOptions.windowsMode;
  }
  _reflow(t2, e) {
    this._cols !== t2 && (t2 > this._cols ? this._reflowLarger(t2, e) : this._reflowSmaller(t2, e));
  }
  _reflowLarger(t2, e) {
    let i = this._optionsService.rawOptions.reflowCursorLine, r = sl(this.lines, this._cols, t2, this.ybase + this.y, this.getNullCell(X), i);
    if (r.length > 0) {
      let n = ol(this.lines, r);
      ll(this.lines, n.layout), this._reflowLargerAdjustViewport(t2, e, n.countRemoved);
    }
  }
  _reflowLargerAdjustViewport(t2, e, i) {
    let r = this.getNullCell(X), n = i;
    for (; n-- > 0; ) this.ybase === 0 ? (this.y > 0 && this.y--, this.lines.length < e && this.lines.push(new Ze(t2, r))) : (this.ydisp === this.ybase && this.ydisp--, this.ybase--);
    this.savedY = Math.max(this.savedY - i, 0);
  }
  _reflowSmaller(t2, e) {
    let i = this._optionsService.rawOptions.reflowCursorLine, r = this.getNullCell(X), n = [], o2 = 0;
    for (let l = this.lines.length - 1; l >= 0; l--) {
      let a = this.lines.get(l);
      if (!a || !a.isWrapped && a.getTrimmedLength() <= t2) continue;
      let u = [a];
      for (; a.isWrapped && l > 0; ) a = this.lines.get(--l), u.unshift(a);
      if (!i) {
        let I = this.ybase + this.y;
        if (I >= l && I < l + u.length) continue;
      }
      let h2 = u[u.length - 1].getTrimmedLength(), c = al(u, this._cols, t2), d = c.length - u.length, _2;
      this.ybase === 0 && this.y !== this.lines.length - 1 ? _2 = Math.max(0, this.y - this.lines.maxLength + d) : _2 = Math.max(0, this.lines.length - this.lines.maxLength + d);
      let p = [];
      for (let I = 0; I < d; I++) {
        let k = this.getBlankLine(X, true);
        p.push(k);
      }
      p.length > 0 && (n.push({ start: l + u.length + o2, newLines: p }), o2 += p.length), u.push(...p);
      let m = c.length - 1, f = c[m];
      f === 0 && (m--, f = c[m]);
      let A = u.length - d - 1, R = h2;
      for (; A >= 0; ) {
        let I = Math.min(R, f);
        if (u[m] === void 0) break;
        if (u[m].copyCellsFrom(u[A], R - I, f - I, I, true), f -= I, f === 0 && (m--, f = c[m]), R -= I, R === 0) {
          A--;
          let k = Math.max(A, 0);
          R = ri(u, k, this._cols);
        }
      }
      for (let I = 0; I < u.length; I++) c[I] < t2 && u[I].setCell(c[I], r);
      let O = d - _2;
      for (; O-- > 0; ) this.ybase === 0 ? this.y < e - 1 ? (this.y++, this.lines.pop()) : (this.ybase++, this.ydisp++) : this.ybase < Math.min(this.lines.maxLength, this.lines.length + o2) - e && (this.ybase === this.ydisp && this.ydisp++, this.ybase++);
      this.savedY = Math.min(this.savedY + d, this.ybase + e - 1);
    }
    if (n.length > 0) {
      let l = [], a = [];
      for (let f = 0; f < this.lines.length; f++) a.push(this.lines.get(f));
      let u = this.lines.length, h2 = u - 1, c = 0, d = n[c];
      this.lines.length = Math.min(this.lines.maxLength, this.lines.length + o2);
      let _2 = 0;
      for (let f = Math.min(this.lines.maxLength - 1, u + o2 - 1); f >= 0; f--) if (d && d.start > h2 + _2) {
        for (let A = d.newLines.length - 1; A >= 0; A--) this.lines.set(f--, d.newLines[A]);
        f++, l.push({ index: h2 + 1, amount: d.newLines.length }), _2 += d.newLines.length, d = n[++c];
      } else this.lines.set(f, a[h2--]);
      let p = 0;
      for (let f = l.length - 1; f >= 0; f--) l[f].index += p, this.lines.onInsertEmitter.fire(l[f]), p += l[f].amount;
      let m = Math.max(0, u + o2 - this.lines.maxLength);
      m > 0 && this.lines.onTrimEmitter.fire(m);
    }
  }
  translateBufferLineToString(t2, e, i = 0, r) {
    let n = this.lines.get(t2);
    return n ? n.translateToString(e, i, r) : "";
  }
  getWrappedRangeForLine(t2) {
    let e = t2, i = t2;
    for (; e > 0 && this.lines.get(e).isWrapped; ) e--;
    for (; i + 1 < this.lines.length && this.lines.get(i + 1).isWrapped; ) i++;
    return { first: e, last: i };
  }
  setupTabStops(t2) {
    for (t2 != null ? this.tabs[t2] || (t2 = this.prevStop(t2)) : (this.tabs = {}, t2 = 0); t2 < this._cols; t2 += this._optionsService.rawOptions.tabStopWidth) this.tabs[t2] = true;
  }
  prevStop(t2) {
    for (t2 == null && (t2 = this.x); !this.tabs[--t2] && t2 > 0; ) ;
    return t2 >= this._cols ? this._cols - 1 : t2 < 0 ? 0 : t2;
  }
  nextStop(t2) {
    for (t2 == null && (t2 = this.x); !this.tabs[++t2] && t2 < this._cols; ) ;
    return t2 >= this._cols ? this._cols - 1 : t2 < 0 ? 0 : t2;
  }
  clearMarkers(t2) {
    this._isClearing = true;
    for (let e = 0; e < this.markers.length; e++) this.markers[e].line === t2 && (this.markers[e].dispose(), this.markers.splice(e--, 1));
    this._isClearing = false;
  }
  clearAllMarkers() {
    this._isClearing = true;
    for (let t2 = 0; t2 < this.markers.length; t2++) this.markers[t2].dispose();
    this.markers.length = 0, this._isClearing = false;
  }
  addMarker(t2) {
    let e = new cn(t2);
    return this.markers.push(e), e.register(this.lines.onTrim((i) => {
      e.line -= i, e.line < 0 && e.dispose();
    })), e.register(this.lines.onInsert((i) => {
      e.line >= i.index && (e.line += i.amount);
    })), e.register(this.lines.onDelete((i) => {
      e.line >= i.index && e.line < i.index + i.amount && e.dispose(), e.line > i.index && (e.line -= i.amount);
    })), e.register(e.onDispose(() => this._removeMarker(e))), e;
  }
  _removeMarker(t2) {
    this._isClearing || this.markers.splice(this.markers.indexOf(t2), 1);
  }
};
var hn = class extends D {
  constructor(e, i) {
    super();
    this._optionsService = e;
    this._bufferService = i;
    this._onBufferActivate = this._register(new v());
    this.onBufferActivate = this._onBufferActivate.event;
    this.reset(), this._register(this._optionsService.onSpecificOptionChange("scrollback", () => this.resize(this._bufferService.cols, this._bufferService.rows))), this._register(this._optionsService.onSpecificOptionChange("tabStopWidth", () => this.setupTabStops()));
  }
  reset() {
    this._normal = new $i(true, this._optionsService, this._bufferService), this._normal.fillViewportRows(), this._alt = new $i(false, this._optionsService, this._bufferService), this._activeBuffer = this._normal, this._onBufferActivate.fire({ activeBuffer: this._normal, inactiveBuffer: this._alt }), this.setupTabStops();
  }
  get alt() {
    return this._alt;
  }
  get active() {
    return this._activeBuffer;
  }
  get normal() {
    return this._normal;
  }
  activateNormalBuffer() {
    this._activeBuffer !== this._normal && (this._normal.x = this._alt.x, this._normal.y = this._alt.y, this._alt.clearAllMarkers(), this._alt.clear(), this._activeBuffer = this._normal, this._onBufferActivate.fire({ activeBuffer: this._normal, inactiveBuffer: this._alt }));
  }
  activateAltBuffer(e) {
    this._activeBuffer !== this._alt && (this._alt.fillViewportRows(e), this._alt.x = this._normal.x, this._alt.y = this._normal.y, this._activeBuffer = this._alt, this._onBufferActivate.fire({ activeBuffer: this._alt, inactiveBuffer: this._normal }));
  }
  resize(e, i) {
    this._normal.resize(e, i), this._alt.resize(e, i), this.setupTabStops(e);
  }
  setupTabStops(e) {
    this._normal.setupTabStops(e), this._alt.setupTabStops(e);
  }
};
var ks = 2;
var Cs = 1;
var ni = class extends D {
  constructor(e) {
    super();
    this.isUserScrolling = false;
    this._onResize = this._register(new v());
    this.onResize = this._onResize.event;
    this._onScroll = this._register(new v());
    this.onScroll = this._onScroll.event;
    this.cols = Math.max(e.rawOptions.cols || 0, ks), this.rows = Math.max(e.rawOptions.rows || 0, Cs), this.buffers = this._register(new hn(e, this)), this._register(this.buffers.onBufferActivate((i) => {
      this._onScroll.fire(i.activeBuffer.ydisp);
    }));
  }
  get buffer() {
    return this.buffers.active;
  }
  resize(e, i) {
    let r = this.cols !== e, n = this.rows !== i;
    this.cols = e, this.rows = i, this.buffers.resize(e, i), this._onResize.fire({ cols: e, rows: i, colsChanged: r, rowsChanged: n });
  }
  reset() {
    this.buffers.reset(), this.isUserScrolling = false;
  }
  scroll(e, i = false) {
    let r = this.buffer, n;
    n = this._cachedBlankLine, (!n || n.length !== this.cols || n.getFg(0) !== e.fg || n.getBg(0) !== e.bg) && (n = r.getBlankLine(e, i), this._cachedBlankLine = n), n.isWrapped = i;
    let o2 = r.ybase + r.scrollTop, l = r.ybase + r.scrollBottom;
    if (r.scrollTop === 0) {
      let a = r.lines.isFull;
      l === r.lines.length - 1 ? a ? r.lines.recycle().copyFrom(n) : r.lines.push(n.clone()) : r.lines.splice(l + 1, 0, n.clone()), a ? this.isUserScrolling && (r.ydisp = Math.max(r.ydisp - 1, 0)) : (r.ybase++, this.isUserScrolling || r.ydisp++);
    } else {
      let a = l - o2 + 1;
      r.lines.shiftElements(o2 + 1, a - 1, -1), r.lines.set(l, n.clone());
    }
    this.isUserScrolling || (r.ydisp = r.ybase), this._onScroll.fire(r.ydisp);
  }
  scrollLines(e, i) {
    let r = this.buffer;
    if (e < 0) {
      if (r.ydisp === 0) return;
      this.isUserScrolling = true;
    } else e + r.ydisp >= r.ybase && (this.isUserScrolling = false);
    let n = r.ydisp;
    r.ydisp = Math.max(Math.min(r.ydisp + e, r.ybase), 0), n !== r.ydisp && (i || this._onScroll.fire(r.ydisp));
  }
};
ni = M([S(0, H)], ni);
var si = { cols: 80, rows: 24, cursorBlink: false, cursorStyle: "block", cursorWidth: 1, cursorInactiveStyle: "outline", customGlyphs: true, drawBoldTextInBrightColors: true, documentOverride: null, fastScrollModifier: "alt", fastScrollSensitivity: 5, fontFamily: "monospace", fontSize: 15, fontWeight: "normal", fontWeightBold: "bold", ignoreBracketedPasteMode: false, lineHeight: 1, letterSpacing: 0, linkHandler: null, logLevel: "info", logger: null, scrollback: 1e3, scrollOnEraseInDisplay: false, scrollOnUserInput: true, scrollSensitivity: 1, screenReaderMode: false, smoothScrollDuration: 0, macOptionIsMeta: false, macOptionClickForcesSelection: false, minimumContrastRatio: 1, disableStdin: false, allowProposedApi: false, allowTransparency: false, tabStopWidth: 8, theme: {}, reflowCursorLine: false, rescaleOverlappingGlyphs: false, rightClickSelectsWord: Zt, windowOptions: {}, windowsMode: false, windowsPty: {}, wordSeparator: " ()[]{}',\"`", altClickMovesCursor: true, convertEol: false, termName: "xterm", cancelEvents: false, overviewRuler: {} };
var nc = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
var dn = class extends D {
  constructor(e) {
    super();
    this._onOptionChange = this._register(new v());
    this.onOptionChange = this._onOptionChange.event;
    let i = { ...si };
    for (let r in e) if (r in i) try {
      let n = e[r];
      i[r] = this._sanitizeAndValidateOption(r, n);
    } catch (n) {
      console.error(n);
    }
    this.rawOptions = i, this.options = { ...i }, this._setupOptions(), this._register(C(() => {
      this.rawOptions.linkHandler = null, this.rawOptions.documentOverride = null;
    }));
  }
  onSpecificOptionChange(e, i) {
    return this.onOptionChange((r) => {
      r === e && i(this.rawOptions[e]);
    });
  }
  onMultipleOptionChange(e, i) {
    return this.onOptionChange((r) => {
      e.indexOf(r) !== -1 && i();
    });
  }
  _setupOptions() {
    let e = (r) => {
      if (!(r in si)) throw new Error(`No option with key "${r}"`);
      return this.rawOptions[r];
    }, i = (r, n) => {
      if (!(r in si)) throw new Error(`No option with key "${r}"`);
      n = this._sanitizeAndValidateOption(r, n), this.rawOptions[r] !== n && (this.rawOptions[r] = n, this._onOptionChange.fire(r));
    };
    for (let r in this.rawOptions) {
      let n = { get: e.bind(this, r), set: i.bind(this, r) };
      Object.defineProperty(this.options, r, n);
    }
  }
  _sanitizeAndValidateOption(e, i) {
    switch (e) {
      case "cursorStyle":
        if (i || (i = si[e]), !sc(i)) throw new Error(`"${i}" is not a valid value for ${e}`);
        break;
      case "wordSeparator":
        i || (i = si[e]);
        break;
      case "fontWeight":
      case "fontWeightBold":
        if (typeof i == "number" && 1 <= i && i <= 1e3) break;
        i = nc.includes(i) ? i : si[e];
        break;
      case "cursorWidth":
        i = Math.floor(i);
      case "lineHeight":
      case "tabStopWidth":
        if (i < 1) throw new Error(`${e} cannot be less than 1, value: ${i}`);
        break;
      case "minimumContrastRatio":
        i = Math.max(1, Math.min(21, Math.round(i * 10) / 10));
        break;
      case "scrollback":
        if (i = Math.min(i, 4294967295), i < 0) throw new Error(`${e} cannot be less than 0, value: ${i}`);
        break;
      case "fastScrollSensitivity":
      case "scrollSensitivity":
        if (i <= 0) throw new Error(`${e} cannot be less than or equal to 0, value: ${i}`);
        break;
      case "rows":
      case "cols":
        if (!i && i !== 0) throw new Error(`${e} must be numeric, value: ${i}`);
        break;
      case "windowsPty":
        i = i ?? {};
        break;
    }
    return i;
  }
};
function sc(s15) {
  return s15 === "block" || s15 === "underline" || s15 === "bar";
}
function oi(s15, t2 = 5) {
  if (typeof s15 != "object") return s15;
  let e = Array.isArray(s15) ? [] : {};
  for (let i in s15) e[i] = t2 <= 1 ? s15[i] : s15[i] && oi(s15[i], t2 - 1);
  return e;
}
var ul = Object.freeze({ insertMode: false });
var hl = Object.freeze({ applicationCursorKeys: false, applicationKeypad: false, bracketedPasteMode: false, cursorBlink: void 0, cursorStyle: void 0, origin: false, reverseWraparound: false, sendFocus: false, synchronizedOutput: false, wraparound: true });
var li = class extends D {
  constructor(e, i, r) {
    super();
    this._bufferService = e;
    this._logService = i;
    this._optionsService = r;
    this.isCursorInitialized = false;
    this.isCursorHidden = false;
    this._onData = this._register(new v());
    this.onData = this._onData.event;
    this._onUserInput = this._register(new v());
    this.onUserInput = this._onUserInput.event;
    this._onBinary = this._register(new v());
    this.onBinary = this._onBinary.event;
    this._onRequestScrollToBottom = this._register(new v());
    this.onRequestScrollToBottom = this._onRequestScrollToBottom.event;
    this.modes = oi(ul), this.decPrivateModes = oi(hl);
  }
  reset() {
    this.modes = oi(ul), this.decPrivateModes = oi(hl);
  }
  triggerDataEvent(e, i = false) {
    if (this._optionsService.rawOptions.disableStdin) return;
    let r = this._bufferService.buffer;
    i && this._optionsService.rawOptions.scrollOnUserInput && r.ybase !== r.ydisp && this._onRequestScrollToBottom.fire(), i && this._onUserInput.fire(), this._logService.debug(`sending data "${e}"`), this._logService.trace("sending data (codes)", () => e.split("").map((n) => n.charCodeAt(0))), this._onData.fire(e);
  }
  triggerBinaryEvent(e) {
    this._optionsService.rawOptions.disableStdin || (this._logService.debug(`sending binary "${e}"`), this._logService.trace("sending binary (codes)", () => e.split("").map((i) => i.charCodeAt(0))), this._onBinary.fire(e));
  }
};
li = M([S(0, F), S(1, nr), S(2, H)], li);
var dl = { NONE: { events: 0, restrict: () => false }, X10: { events: 1, restrict: (s15) => s15.button === 4 || s15.action !== 1 ? false : (s15.ctrl = false, s15.alt = false, s15.shift = false, true) }, VT200: { events: 19, restrict: (s15) => s15.action !== 32 }, DRAG: { events: 23, restrict: (s15) => !(s15.action === 32 && s15.button === 3) }, ANY: { events: 31, restrict: (s15) => true } };
function Ms(s15, t2) {
  let e = (s15.ctrl ? 16 : 0) | (s15.shift ? 4 : 0) | (s15.alt ? 8 : 0);
  return s15.button === 4 ? (e |= 64, e |= s15.action) : (e |= s15.button & 3, s15.button & 4 && (e |= 64), s15.button & 8 && (e |= 128), s15.action === 32 ? e |= 32 : s15.action === 0 && !t2 && (e |= 3)), e;
}
var Ps = String.fromCharCode;
var fl = { DEFAULT: (s15) => {
  let t2 = [Ms(s15, false) + 32, s15.col + 32, s15.row + 32];
  return t2[0] > 255 || t2[1] > 255 || t2[2] > 255 ? "" : `\x1B[M${Ps(t2[0])}${Ps(t2[1])}${Ps(t2[2])}`;
}, SGR: (s15) => {
  let t2 = s15.action === 0 && s15.button !== 4 ? "m" : "M";
  return `\x1B[<${Ms(s15, true)};${s15.col};${s15.row}${t2}`;
}, SGR_PIXELS: (s15) => {
  let t2 = s15.action === 0 && s15.button !== 4 ? "m" : "M";
  return `\x1B[<${Ms(s15, true)};${s15.x};${s15.y}${t2}`;
} };
var ai = class extends D {
  constructor(e, i, r) {
    super();
    this._bufferService = e;
    this._coreService = i;
    this._optionsService = r;
    this._protocols = {};
    this._encodings = {};
    this._activeProtocol = "";
    this._activeEncoding = "";
    this._lastEvent = null;
    this._wheelPartialScroll = 0;
    this._onProtocolChange = this._register(new v());
    this.onProtocolChange = this._onProtocolChange.event;
    for (let n of Object.keys(dl)) this.addProtocol(n, dl[n]);
    for (let n of Object.keys(fl)) this.addEncoding(n, fl[n]);
    this.reset();
  }
  addProtocol(e, i) {
    this._protocols[e] = i;
  }
  addEncoding(e, i) {
    this._encodings[e] = i;
  }
  get activeProtocol() {
    return this._activeProtocol;
  }
  get areMouseEventsActive() {
    return this._protocols[this._activeProtocol].events !== 0;
  }
  set activeProtocol(e) {
    if (!this._protocols[e]) throw new Error(`unknown protocol "${e}"`);
    this._activeProtocol = e, this._onProtocolChange.fire(this._protocols[e].events);
  }
  get activeEncoding() {
    return this._activeEncoding;
  }
  set activeEncoding(e) {
    if (!this._encodings[e]) throw new Error(`unknown encoding "${e}"`);
    this._activeEncoding = e;
  }
  reset() {
    this.activeProtocol = "NONE", this.activeEncoding = "DEFAULT", this._lastEvent = null, this._wheelPartialScroll = 0;
  }
  consumeWheelEvent(e, i, r) {
    if (e.deltaY === 0 || e.shiftKey || i === void 0 || r === void 0) return 0;
    let n = i / r, o2 = this._applyScrollModifier(e.deltaY, e);
    return e.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? (o2 /= n + 0, Math.abs(e.deltaY) < 50 && (o2 *= 0.3), this._wheelPartialScroll += o2, o2 = Math.floor(Math.abs(this._wheelPartialScroll)) * (this._wheelPartialScroll > 0 ? 1 : -1), this._wheelPartialScroll %= 1) : e.deltaMode === WheelEvent.DOM_DELTA_PAGE && (o2 *= this._bufferService.rows), o2;
  }
  _applyScrollModifier(e, i) {
    return i.altKey || i.ctrlKey || i.shiftKey ? e * this._optionsService.rawOptions.fastScrollSensitivity * this._optionsService.rawOptions.scrollSensitivity : e * this._optionsService.rawOptions.scrollSensitivity;
  }
  triggerMouseEvent(e) {
    if (e.col < 0 || e.col >= this._bufferService.cols || e.row < 0 || e.row >= this._bufferService.rows || e.button === 4 && e.action === 32 || e.button === 3 && e.action !== 32 || e.button !== 4 && (e.action === 2 || e.action === 3) || (e.col++, e.row++, e.action === 32 && this._lastEvent && this._equalEvents(this._lastEvent, e, this._activeEncoding === "SGR_PIXELS")) || !this._protocols[this._activeProtocol].restrict(e)) return false;
    let i = this._encodings[this._activeEncoding](e);
    return i && (this._activeEncoding === "DEFAULT" ? this._coreService.triggerBinaryEvent(i) : this._coreService.triggerDataEvent(i, true)), this._lastEvent = e, true;
  }
  explainEvents(e) {
    return { down: !!(e & 1), up: !!(e & 2), drag: !!(e & 4), move: !!(e & 8), wheel: !!(e & 16) };
  }
  _equalEvents(e, i, r) {
    if (r) {
      if (e.x !== i.x || e.y !== i.y) return false;
    } else if (e.col !== i.col || e.row !== i.row) return false;
    return !(e.button !== i.button || e.action !== i.action || e.ctrl !== i.ctrl || e.alt !== i.alt || e.shift !== i.shift);
  }
};
ai = M([S(0, F), S(1, ge), S(2, H)], ai);
var Os = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531]];
var ac = [[68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]];
var se;
function cc(s15, t2) {
  let e = 0, i = t2.length - 1, r;
  if (s15 < t2[0][0] || s15 > t2[i][1]) return false;
  for (; i >= e; ) if (r = e + i >> 1, s15 > t2[r][1]) e = r + 1;
  else if (s15 < t2[r][0]) i = r - 1;
  else return true;
  return false;
}
var fn = class {
  constructor() {
    this.version = "6";
    if (!se) {
      se = new Uint8Array(65536), se.fill(1), se[0] = 0, se.fill(0, 1, 32), se.fill(0, 127, 160), se.fill(2, 4352, 4448), se[9001] = 2, se[9002] = 2, se.fill(2, 11904, 42192), se[12351] = 1, se.fill(2, 44032, 55204), se.fill(2, 63744, 64256), se.fill(2, 65040, 65050), se.fill(2, 65072, 65136), se.fill(2, 65280, 65377), se.fill(2, 65504, 65511);
      for (let t2 = 0; t2 < Os.length; ++t2) se.fill(0, Os[t2][0], Os[t2][1] + 1);
    }
  }
  wcwidth(t2) {
    return t2 < 32 ? 0 : t2 < 127 ? 1 : t2 < 65536 ? se[t2] : cc(t2, ac) ? 0 : t2 >= 131072 && t2 <= 196605 || t2 >= 196608 && t2 <= 262141 ? 2 : 1;
  }
  charProperties(t2, e) {
    let i = this.wcwidth(t2), r = i === 0 && e !== 0;
    if (r) {
      let n = Ae.extractWidth(e);
      n === 0 ? r = false : n > i && (i = n);
    }
    return Ae.createPropertyValue(0, i, r);
  }
};
var Ae = class s13 {
  constructor() {
    this._providers = /* @__PURE__ */ Object.create(null);
    this._active = "";
    this._onChange = new v();
    this.onChange = this._onChange.event;
    let t2 = new fn();
    this.register(t2), this._active = t2.version, this._activeProvider = t2;
  }
  static extractShouldJoin(t2) {
    return (t2 & 1) !== 0;
  }
  static extractWidth(t2) {
    return t2 >> 1 & 3;
  }
  static extractCharKind(t2) {
    return t2 >> 3;
  }
  static createPropertyValue(t2, e, i = false) {
    return (t2 & 16777215) << 3 | (e & 3) << 1 | (i ? 1 : 0);
  }
  dispose() {
    this._onChange.dispose();
  }
  get versions() {
    return Object.keys(this._providers);
  }
  get activeVersion() {
    return this._active;
  }
  set activeVersion(t2) {
    if (!this._providers[t2]) throw new Error(`unknown Unicode version "${t2}"`);
    this._active = t2, this._activeProvider = this._providers[t2], this._onChange.fire(t2);
  }
  register(t2) {
    this._providers[t2.version] = t2;
  }
  wcwidth(t2) {
    return this._activeProvider.wcwidth(t2);
  }
  getStringCellWidth(t2) {
    let e = 0, i = 0, r = t2.length;
    for (let n = 0; n < r; ++n) {
      let o2 = t2.charCodeAt(n);
      if (55296 <= o2 && o2 <= 56319) {
        if (++n >= r) return e + this.wcwidth(o2);
        let u = t2.charCodeAt(n);
        56320 <= u && u <= 57343 ? o2 = (o2 - 55296) * 1024 + u - 56320 + 65536 : e += this.wcwidth(u);
      }
      let l = this.charProperties(o2, i), a = s13.extractWidth(l);
      s13.extractShouldJoin(l) && (a -= s13.extractWidth(i)), e += a, i = l;
    }
    return e;
  }
  charProperties(t2, e) {
    return this._activeProvider.charProperties(t2, e);
  }
};
var pn = class {
  constructor() {
    this.glevel = 0;
    this._charsets = [];
  }
  reset() {
    this.charset = void 0, this._charsets = [], this.glevel = 0;
  }
  setgLevel(t2) {
    this.glevel = t2, this.charset = this._charsets[t2];
  }
  setgCharset(t2, e) {
    this._charsets[t2] = e, this.glevel === t2 && (this.charset = e);
  }
};
function Bs(s15) {
  let e = s15.buffer.lines.get(s15.buffer.ybase + s15.buffer.y - 1)?.get(s15.cols - 1), i = s15.buffer.lines.get(s15.buffer.ybase + s15.buffer.y);
  i && e && (i.isWrapped = e[3] !== 0 && e[3] !== 32);
}
var Vi = 2147483647;
var uc = 256;
var ci = class s14 {
  constructor(t2 = 32, e = 32) {
    this.maxLength = t2;
    this.maxSubParamsLength = e;
    if (e > uc) throw new Error("maxSubParamsLength must not be greater than 256");
    this.params = new Int32Array(t2), this.length = 0, this._subParams = new Int32Array(e), this._subParamsLength = 0, this._subParamsIdx = new Uint16Array(t2), this._rejectDigits = false, this._rejectSubDigits = false, this._digitIsSub = false;
  }
  static fromArray(t2) {
    let e = new s14();
    if (!t2.length) return e;
    for (let i = Array.isArray(t2[0]) ? 1 : 0; i < t2.length; ++i) {
      let r = t2[i];
      if (Array.isArray(r)) for (let n = 0; n < r.length; ++n) e.addSubParam(r[n]);
      else e.addParam(r);
    }
    return e;
  }
  clone() {
    let t2 = new s14(this.maxLength, this.maxSubParamsLength);
    return t2.params.set(this.params), t2.length = this.length, t2._subParams.set(this._subParams), t2._subParamsLength = this._subParamsLength, t2._subParamsIdx.set(this._subParamsIdx), t2._rejectDigits = this._rejectDigits, t2._rejectSubDigits = this._rejectSubDigits, t2._digitIsSub = this._digitIsSub, t2;
  }
  toArray() {
    let t2 = [];
    for (let e = 0; e < this.length; ++e) {
      t2.push(this.params[e]);
      let i = this._subParamsIdx[e] >> 8, r = this._subParamsIdx[e] & 255;
      r - i > 0 && t2.push(Array.prototype.slice.call(this._subParams, i, r));
    }
    return t2;
  }
  reset() {
    this.length = 0, this._subParamsLength = 0, this._rejectDigits = false, this._rejectSubDigits = false, this._digitIsSub = false;
  }
  addParam(t2) {
    if (this._digitIsSub = false, this.length >= this.maxLength) {
      this._rejectDigits = true;
      return;
    }
    if (t2 < -1) throw new Error("values lesser than -1 are not allowed");
    this._subParamsIdx[this.length] = this._subParamsLength << 8 | this._subParamsLength, this.params[this.length++] = t2 > Vi ? Vi : t2;
  }
  addSubParam(t2) {
    if (this._digitIsSub = true, !!this.length) {
      if (this._rejectDigits || this._subParamsLength >= this.maxSubParamsLength) {
        this._rejectSubDigits = true;
        return;
      }
      if (t2 < -1) throw new Error("values lesser than -1 are not allowed");
      this._subParams[this._subParamsLength++] = t2 > Vi ? Vi : t2, this._subParamsIdx[this.length - 1]++;
    }
  }
  hasSubParams(t2) {
    return (this._subParamsIdx[t2] & 255) - (this._subParamsIdx[t2] >> 8) > 0;
  }
  getSubParams(t2) {
    let e = this._subParamsIdx[t2] >> 8, i = this._subParamsIdx[t2] & 255;
    return i - e > 0 ? this._subParams.subarray(e, i) : null;
  }
  getSubParamsAll() {
    let t2 = {};
    for (let e = 0; e < this.length; ++e) {
      let i = this._subParamsIdx[e] >> 8, r = this._subParamsIdx[e] & 255;
      r - i > 0 && (t2[e] = this._subParams.slice(i, r));
    }
    return t2;
  }
  addDigit(t2) {
    let e;
    if (this._rejectDigits || !(e = this._digitIsSub ? this._subParamsLength : this.length) || this._digitIsSub && this._rejectSubDigits) return;
    let i = this._digitIsSub ? this._subParams : this.params, r = i[e - 1];
    i[e - 1] = ~r ? Math.min(r * 10 + t2, Vi) : t2;
  }
};
var qi = [];
var mn = class {
  constructor() {
    this._state = 0;
    this._active = qi;
    this._id = -1;
    this._handlers = /* @__PURE__ */ Object.create(null);
    this._handlerFb = () => {
    };
    this._stack = { paused: false, loopPosition: 0, fallThrough: false };
  }
  registerHandler(t2, e) {
    this._handlers[t2] === void 0 && (this._handlers[t2] = []);
    let i = this._handlers[t2];
    return i.push(e), { dispose: () => {
      let r = i.indexOf(e);
      r !== -1 && i.splice(r, 1);
    } };
  }
  clearHandler(t2) {
    this._handlers[t2] && delete this._handlers[t2];
  }
  setHandlerFallback(t2) {
    this._handlerFb = t2;
  }
  dispose() {
    this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
    }, this._active = qi;
  }
  reset() {
    if (this._state === 2) for (let t2 = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; t2 >= 0; --t2) this._active[t2].end(false);
    this._stack.paused = false, this._active = qi, this._id = -1, this._state = 0;
  }
  _start() {
    if (this._active = this._handlers[this._id] || qi, !this._active.length) this._handlerFb(this._id, "START");
    else for (let t2 = this._active.length - 1; t2 >= 0; t2--) this._active[t2].start();
  }
  _put(t2, e, i) {
    if (!this._active.length) this._handlerFb(this._id, "PUT", It(t2, e, i));
    else for (let r = this._active.length - 1; r >= 0; r--) this._active[r].put(t2, e, i);
  }
  start() {
    this.reset(), this._state = 1;
  }
  put(t2, e, i) {
    if (this._state !== 3) {
      if (this._state === 1) for (; e < i; ) {
        let r = t2[e++];
        if (r === 59) {
          this._state = 2, this._start();
          break;
        }
        if (r < 48 || 57 < r) {
          this._state = 3;
          return;
        }
        this._id === -1 && (this._id = 0), this._id = this._id * 10 + r - 48;
      }
      this._state === 2 && i - e > 0 && this._put(t2, e, i);
    }
  }
  end(t2, e = true) {
    if (this._state !== 0) {
      if (this._state !== 3) if (this._state === 1 && this._start(), !this._active.length) this._handlerFb(this._id, "END", t2);
      else {
        let i = false, r = this._active.length - 1, n = false;
        if (this._stack.paused && (r = this._stack.loopPosition - 1, i = e, n = this._stack.fallThrough, this._stack.paused = false), !n && i === false) {
          for (; r >= 0 && (i = this._active[r].end(t2), i !== true); r--) if (i instanceof Promise) return this._stack.paused = true, this._stack.loopPosition = r, this._stack.fallThrough = false, i;
          r--;
        }
        for (; r >= 0; r--) if (i = this._active[r].end(false), i instanceof Promise) return this._stack.paused = true, this._stack.loopPosition = r, this._stack.fallThrough = true, i;
      }
      this._active = qi, this._id = -1, this._state = 0;
    }
  }
};
var pe = class {
  constructor(t2) {
    this._handler = t2;
    this._data = "";
    this._hitLimit = false;
  }
  start() {
    this._data = "", this._hitLimit = false;
  }
  put(t2, e, i) {
    this._hitLimit || (this._data += It(t2, e, i), this._data.length > 1e7 && (this._data = "", this._hitLimit = true));
  }
  end(t2) {
    let e = false;
    if (this._hitLimit) e = false;
    else if (t2 && (e = this._handler(this._data), e instanceof Promise)) return e.then((i) => (this._data = "", this._hitLimit = false, i));
    return this._data = "", this._hitLimit = false, e;
  }
};
var Yi = [];
var _n = class {
  constructor() {
    this._handlers = /* @__PURE__ */ Object.create(null);
    this._active = Yi;
    this._ident = 0;
    this._handlerFb = () => {
    };
    this._stack = { paused: false, loopPosition: 0, fallThrough: false };
  }
  dispose() {
    this._handlers = /* @__PURE__ */ Object.create(null), this._handlerFb = () => {
    }, this._active = Yi;
  }
  registerHandler(t2, e) {
    this._handlers[t2] === void 0 && (this._handlers[t2] = []);
    let i = this._handlers[t2];
    return i.push(e), { dispose: () => {
      let r = i.indexOf(e);
      r !== -1 && i.splice(r, 1);
    } };
  }
  clearHandler(t2) {
    this._handlers[t2] && delete this._handlers[t2];
  }
  setHandlerFallback(t2) {
    this._handlerFb = t2;
  }
  reset() {
    if (this._active.length) for (let t2 = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; t2 >= 0; --t2) this._active[t2].unhook(false);
    this._stack.paused = false, this._active = Yi, this._ident = 0;
  }
  hook(t2, e) {
    if (this.reset(), this._ident = t2, this._active = this._handlers[t2] || Yi, !this._active.length) this._handlerFb(this._ident, "HOOK", e);
    else for (let i = this._active.length - 1; i >= 0; i--) this._active[i].hook(e);
  }
  put(t2, e, i) {
    if (!this._active.length) this._handlerFb(this._ident, "PUT", It(t2, e, i));
    else for (let r = this._active.length - 1; r >= 0; r--) this._active[r].put(t2, e, i);
  }
  unhook(t2, e = true) {
    if (!this._active.length) this._handlerFb(this._ident, "UNHOOK", t2);
    else {
      let i = false, r = this._active.length - 1, n = false;
      if (this._stack.paused && (r = this._stack.loopPosition - 1, i = e, n = this._stack.fallThrough, this._stack.paused = false), !n && i === false) {
        for (; r >= 0 && (i = this._active[r].unhook(t2), i !== true); r--) if (i instanceof Promise) return this._stack.paused = true, this._stack.loopPosition = r, this._stack.fallThrough = false, i;
        r--;
      }
      for (; r >= 0; r--) if (i = this._active[r].unhook(false), i instanceof Promise) return this._stack.paused = true, this._stack.loopPosition = r, this._stack.fallThrough = true, i;
    }
    this._active = Yi, this._ident = 0;
  }
};
var ji = new ci();
ji.addParam(0);
var Xi = class {
  constructor(t2) {
    this._handler = t2;
    this._data = "";
    this._params = ji;
    this._hitLimit = false;
  }
  hook(t2) {
    this._params = t2.length > 1 || t2.params[0] ? t2.clone() : ji, this._data = "", this._hitLimit = false;
  }
  put(t2, e, i) {
    this._hitLimit || (this._data += It(t2, e, i), this._data.length > 1e7 && (this._data = "", this._hitLimit = true));
  }
  unhook(t2) {
    let e = false;
    if (this._hitLimit) e = false;
    else if (t2 && (e = this._handler(this._data, this._params), e instanceof Promise)) return e.then((i) => (this._params = ji, this._data = "", this._hitLimit = false, i));
    return this._params = ji, this._data = "", this._hitLimit = false, e;
  }
};
var Fs = class {
  constructor(t2) {
    this.table = new Uint8Array(t2);
  }
  setDefault(t2, e) {
    this.table.fill(t2 << 4 | e);
  }
  add(t2, e, i, r) {
    this.table[e << 8 | t2] = i << 4 | r;
  }
  addMany(t2, e, i, r) {
    for (let n = 0; n < t2.length; n++) this.table[e << 8 | t2[n]] = i << 4 | r;
  }
};
var ke = 160;
var hc = (function() {
  let s15 = new Fs(4095), e = Array.apply(null, Array(256)).map((a, u) => u), i = (a, u) => e.slice(a, u), r = i(32, 127), n = i(0, 24);
  n.push(25), n.push.apply(n, i(28, 32));
  let o2 = i(0, 14), l;
  s15.setDefault(1, 0), s15.addMany(r, 0, 2, 0);
  for (l in o2) s15.addMany([24, 26, 153, 154], l, 3, 0), s15.addMany(i(128, 144), l, 3, 0), s15.addMany(i(144, 152), l, 3, 0), s15.add(156, l, 0, 0), s15.add(27, l, 11, 1), s15.add(157, l, 4, 8), s15.addMany([152, 158, 159], l, 0, 7), s15.add(155, l, 11, 3), s15.add(144, l, 11, 9);
  return s15.addMany(n, 0, 3, 0), s15.addMany(n, 1, 3, 1), s15.add(127, 1, 0, 1), s15.addMany(n, 8, 0, 8), s15.addMany(n, 3, 3, 3), s15.add(127, 3, 0, 3), s15.addMany(n, 4, 3, 4), s15.add(127, 4, 0, 4), s15.addMany(n, 6, 3, 6), s15.addMany(n, 5, 3, 5), s15.add(127, 5, 0, 5), s15.addMany(n, 2, 3, 2), s15.add(127, 2, 0, 2), s15.add(93, 1, 4, 8), s15.addMany(r, 8, 5, 8), s15.add(127, 8, 5, 8), s15.addMany([156, 27, 24, 26, 7], 8, 6, 0), s15.addMany(i(28, 32), 8, 0, 8), s15.addMany([88, 94, 95], 1, 0, 7), s15.addMany(r, 7, 0, 7), s15.addMany(n, 7, 0, 7), s15.add(156, 7, 0, 0), s15.add(127, 7, 0, 7), s15.add(91, 1, 11, 3), s15.addMany(i(64, 127), 3, 7, 0), s15.addMany(i(48, 60), 3, 8, 4), s15.addMany([60, 61, 62, 63], 3, 9, 4), s15.addMany(i(48, 60), 4, 8, 4), s15.addMany(i(64, 127), 4, 7, 0), s15.addMany([60, 61, 62, 63], 4, 0, 6), s15.addMany(i(32, 64), 6, 0, 6), s15.add(127, 6, 0, 6), s15.addMany(i(64, 127), 6, 0, 0), s15.addMany(i(32, 48), 3, 9, 5), s15.addMany(i(32, 48), 5, 9, 5), s15.addMany(i(48, 64), 5, 0, 6), s15.addMany(i(64, 127), 5, 7, 0), s15.addMany(i(32, 48), 4, 9, 5), s15.addMany(i(32, 48), 1, 9, 2), s15.addMany(i(32, 48), 2, 9, 2), s15.addMany(i(48, 127), 2, 10, 0), s15.addMany(i(48, 80), 1, 10, 0), s15.addMany(i(81, 88), 1, 10, 0), s15.addMany([89, 90, 92], 1, 10, 0), s15.addMany(i(96, 127), 1, 10, 0), s15.add(80, 1, 11, 9), s15.addMany(n, 9, 0, 9), s15.add(127, 9, 0, 9), s15.addMany(i(28, 32), 9, 0, 9), s15.addMany(i(32, 48), 9, 9, 12), s15.addMany(i(48, 60), 9, 8, 10), s15.addMany([60, 61, 62, 63], 9, 9, 10), s15.addMany(n, 11, 0, 11), s15.addMany(i(32, 128), 11, 0, 11), s15.addMany(i(28, 32), 11, 0, 11), s15.addMany(n, 10, 0, 10), s15.add(127, 10, 0, 10), s15.addMany(i(28, 32), 10, 0, 10), s15.addMany(i(48, 60), 10, 8, 10), s15.addMany([60, 61, 62, 63], 10, 0, 11), s15.addMany(i(32, 48), 10, 9, 12), s15.addMany(n, 12, 0, 12), s15.add(127, 12, 0, 12), s15.addMany(i(28, 32), 12, 0, 12), s15.addMany(i(32, 48), 12, 9, 12), s15.addMany(i(48, 64), 12, 0, 11), s15.addMany(i(64, 127), 12, 12, 13), s15.addMany(i(64, 127), 10, 12, 13), s15.addMany(i(64, 127), 9, 12, 13), s15.addMany(n, 13, 13, 13), s15.addMany(r, 13, 13, 13), s15.add(127, 13, 0, 13), s15.addMany([27, 156, 24, 26], 13, 14, 0), s15.add(ke, 0, 2, 0), s15.add(ke, 8, 5, 8), s15.add(ke, 6, 0, 6), s15.add(ke, 11, 0, 11), s15.add(ke, 13, 13, 13), s15;
})();
var bn = class extends D {
  constructor(e = hc) {
    super();
    this._transitions = e;
    this._parseStack = { state: 0, handlers: [], handlerPos: 0, transition: 0, chunkPos: 0 };
    this.initialState = 0, this.currentState = this.initialState, this._params = new ci(), this._params.addParam(0), this._collect = 0, this.precedingJoinState = 0, this._printHandlerFb = (i, r, n) => {
    }, this._executeHandlerFb = (i) => {
    }, this._csiHandlerFb = (i, r) => {
    }, this._escHandlerFb = (i) => {
    }, this._errorHandlerFb = (i) => i, this._printHandler = this._printHandlerFb, this._executeHandlers = /* @__PURE__ */ Object.create(null), this._csiHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null), this._register(C(() => {
      this._csiHandlers = /* @__PURE__ */ Object.create(null), this._executeHandlers = /* @__PURE__ */ Object.create(null), this._escHandlers = /* @__PURE__ */ Object.create(null);
    })), this._oscParser = this._register(new mn()), this._dcsParser = this._register(new _n()), this._errorHandler = this._errorHandlerFb, this.registerEscHandler({ final: "\\" }, () => true);
  }
  _identifier(e, i = [64, 126]) {
    let r = 0;
    if (e.prefix) {
      if (e.prefix.length > 1) throw new Error("only one byte as prefix supported");
      if (r = e.prefix.charCodeAt(0), r && 60 > r || r > 63) throw new Error("prefix must be in range 0x3c .. 0x3f");
    }
    if (e.intermediates) {
      if (e.intermediates.length > 2) throw new Error("only two bytes as intermediates are supported");
      for (let o2 = 0; o2 < e.intermediates.length; ++o2) {
        let l = e.intermediates.charCodeAt(o2);
        if (32 > l || l > 47) throw new Error("intermediate must be in range 0x20 .. 0x2f");
        r <<= 8, r |= l;
      }
    }
    if (e.final.length !== 1) throw new Error("final must be a single byte");
    let n = e.final.charCodeAt(0);
    if (i[0] > n || n > i[1]) throw new Error(`final must be in range ${i[0]} .. ${i[1]}`);
    return r <<= 8, r |= n, r;
  }
  identToString(e) {
    let i = [];
    for (; e; ) i.push(String.fromCharCode(e & 255)), e >>= 8;
    return i.reverse().join("");
  }
  setPrintHandler(e) {
    this._printHandler = e;
  }
  clearPrintHandler() {
    this._printHandler = this._printHandlerFb;
  }
  registerEscHandler(e, i) {
    let r = this._identifier(e, [48, 126]);
    this._escHandlers[r] === void 0 && (this._escHandlers[r] = []);
    let n = this._escHandlers[r];
    return n.push(i), { dispose: () => {
      let o2 = n.indexOf(i);
      o2 !== -1 && n.splice(o2, 1);
    } };
  }
  clearEscHandler(e) {
    this._escHandlers[this._identifier(e, [48, 126])] && delete this._escHandlers[this._identifier(e, [48, 126])];
  }
  setEscHandlerFallback(e) {
    this._escHandlerFb = e;
  }
  setExecuteHandler(e, i) {
    this._executeHandlers[e.charCodeAt(0)] = i;
  }
  clearExecuteHandler(e) {
    this._executeHandlers[e.charCodeAt(0)] && delete this._executeHandlers[e.charCodeAt(0)];
  }
  setExecuteHandlerFallback(e) {
    this._executeHandlerFb = e;
  }
  registerCsiHandler(e, i) {
    let r = this._identifier(e);
    this._csiHandlers[r] === void 0 && (this._csiHandlers[r] = []);
    let n = this._csiHandlers[r];
    return n.push(i), { dispose: () => {
      let o2 = n.indexOf(i);
      o2 !== -1 && n.splice(o2, 1);
    } };
  }
  clearCsiHandler(e) {
    this._csiHandlers[this._identifier(e)] && delete this._csiHandlers[this._identifier(e)];
  }
  setCsiHandlerFallback(e) {
    this._csiHandlerFb = e;
  }
  registerDcsHandler(e, i) {
    return this._dcsParser.registerHandler(this._identifier(e), i);
  }
  clearDcsHandler(e) {
    this._dcsParser.clearHandler(this._identifier(e));
  }
  setDcsHandlerFallback(e) {
    this._dcsParser.setHandlerFallback(e);
  }
  registerOscHandler(e, i) {
    return this._oscParser.registerHandler(e, i);
  }
  clearOscHandler(e) {
    this._oscParser.clearHandler(e);
  }
  setOscHandlerFallback(e) {
    this._oscParser.setHandlerFallback(e);
  }
  setErrorHandler(e) {
    this._errorHandler = e;
  }
  clearErrorHandler() {
    this._errorHandler = this._errorHandlerFb;
  }
  reset() {
    this.currentState = this.initialState, this._oscParser.reset(), this._dcsParser.reset(), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingJoinState = 0, this._parseStack.state !== 0 && (this._parseStack.state = 2, this._parseStack.handlers = []);
  }
  _preserveStack(e, i, r, n, o2) {
    this._parseStack.state = e, this._parseStack.handlers = i, this._parseStack.handlerPos = r, this._parseStack.transition = n, this._parseStack.chunkPos = o2;
  }
  parse(e, i, r) {
    let n = 0, o2 = 0, l = 0, a;
    if (this._parseStack.state) if (this._parseStack.state === 2) this._parseStack.state = 0, l = this._parseStack.chunkPos + 1;
    else {
      if (r === void 0 || this._parseStack.state === 1) throw this._parseStack.state = 1, new Error("improper continuation due to previous async handler, giving up parsing");
      let u = this._parseStack.handlers, h2 = this._parseStack.handlerPos - 1;
      switch (this._parseStack.state) {
        case 3:
          if (r === false && h2 > -1) {
            for (; h2 >= 0 && (a = u[h2](this._params), a !== true); h2--) if (a instanceof Promise) return this._parseStack.handlerPos = h2, a;
          }
          this._parseStack.handlers = [];
          break;
        case 4:
          if (r === false && h2 > -1) {
            for (; h2 >= 0 && (a = u[h2](), a !== true); h2--) if (a instanceof Promise) return this._parseStack.handlerPos = h2, a;
          }
          this._parseStack.handlers = [];
          break;
        case 6:
          if (n = e[this._parseStack.chunkPos], a = this._dcsParser.unhook(n !== 24 && n !== 26, r), a) return a;
          n === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
          break;
        case 5:
          if (n = e[this._parseStack.chunkPos], a = this._oscParser.end(n !== 24 && n !== 26, r), a) return a;
          n === 27 && (this._parseStack.transition |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0;
          break;
      }
      this._parseStack.state = 0, l = this._parseStack.chunkPos + 1, this.precedingJoinState = 0, this.currentState = this._parseStack.transition & 15;
    }
    for (let u = l; u < i; ++u) {
      switch (n = e[u], o2 = this._transitions.table[this.currentState << 8 | (n < 160 ? n : ke)], o2 >> 4) {
        case 2:
          for (let m = u + 1; ; ++m) {
            if (m >= i || (n = e[m]) < 32 || n > 126 && n < ke) {
              this._printHandler(e, u, m), u = m - 1;
              break;
            }
            if (++m >= i || (n = e[m]) < 32 || n > 126 && n < ke) {
              this._printHandler(e, u, m), u = m - 1;
              break;
            }
            if (++m >= i || (n = e[m]) < 32 || n > 126 && n < ke) {
              this._printHandler(e, u, m), u = m - 1;
              break;
            }
            if (++m >= i || (n = e[m]) < 32 || n > 126 && n < ke) {
              this._printHandler(e, u, m), u = m - 1;
              break;
            }
          }
          break;
        case 3:
          this._executeHandlers[n] ? this._executeHandlers[n]() : this._executeHandlerFb(n), this.precedingJoinState = 0;
          break;
        case 0:
          break;
        case 1:
          if (this._errorHandler({ position: u, code: n, currentState: this.currentState, collect: this._collect, params: this._params, abort: false }).abort) return;
          break;
        case 7:
          let c = this._csiHandlers[this._collect << 8 | n], d = c ? c.length - 1 : -1;
          for (; d >= 0 && (a = c[d](this._params), a !== true); d--) if (a instanceof Promise) return this._preserveStack(3, c, d, o2, u), a;
          d < 0 && this._csiHandlerFb(this._collect << 8 | n, this._params), this.precedingJoinState = 0;
          break;
        case 8:
          do
            switch (n) {
              case 59:
                this._params.addParam(0);
                break;
              case 58:
                this._params.addSubParam(-1);
                break;
              default:
                this._params.addDigit(n - 48);
            }
          while (++u < i && (n = e[u]) > 47 && n < 60);
          u--;
          break;
        case 9:
          this._collect <<= 8, this._collect |= n;
          break;
        case 10:
          let _2 = this._escHandlers[this._collect << 8 | n], p = _2 ? _2.length - 1 : -1;
          for (; p >= 0 && (a = _2[p](), a !== true); p--) if (a instanceof Promise) return this._preserveStack(4, _2, p, o2, u), a;
          p < 0 && this._escHandlerFb(this._collect << 8 | n), this.precedingJoinState = 0;
          break;
        case 11:
          this._params.reset(), this._params.addParam(0), this._collect = 0;
          break;
        case 12:
          this._dcsParser.hook(this._collect << 8 | n, this._params);
          break;
        case 13:
          for (let m = u + 1; ; ++m) if (m >= i || (n = e[m]) === 24 || n === 26 || n === 27 || n > 127 && n < ke) {
            this._dcsParser.put(e, u, m), u = m - 1;
            break;
          }
          break;
        case 14:
          if (a = this._dcsParser.unhook(n !== 24 && n !== 26), a) return this._preserveStack(6, [], 0, o2, u), a;
          n === 27 && (o2 |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingJoinState = 0;
          break;
        case 4:
          this._oscParser.start();
          break;
        case 5:
          for (let m = u + 1; ; m++) if (m >= i || (n = e[m]) < 32 || n > 127 && n < ke) {
            this._oscParser.put(e, u, m), u = m - 1;
            break;
          }
          break;
        case 6:
          if (a = this._oscParser.end(n !== 24 && n !== 26), a) return this._preserveStack(5, [], 0, o2, u), a;
          n === 27 && (o2 |= 1), this._params.reset(), this._params.addParam(0), this._collect = 0, this.precedingJoinState = 0;
          break;
      }
      this.currentState = o2 & 15;
    }
  }
};
var dc = /^([\da-f])\/([\da-f])\/([\da-f])$|^([\da-f]{2})\/([\da-f]{2})\/([\da-f]{2})$|^([\da-f]{3})\/([\da-f]{3})\/([\da-f]{3})$|^([\da-f]{4})\/([\da-f]{4})\/([\da-f]{4})$/;
var fc = /^[\da-f]+$/;
function Ws(s15) {
  if (!s15) return;
  let t2 = s15.toLowerCase();
  if (t2.indexOf("rgb:") === 0) {
    t2 = t2.slice(4);
    let e = dc.exec(t2);
    if (e) {
      let i = e[1] ? 15 : e[4] ? 255 : e[7] ? 4095 : 65535;
      return [Math.round(parseInt(e[1] || e[4] || e[7] || e[10], 16) / i * 255), Math.round(parseInt(e[2] || e[5] || e[8] || e[11], 16) / i * 255), Math.round(parseInt(e[3] || e[6] || e[9] || e[12], 16) / i * 255)];
    }
  } else if (t2.indexOf("#") === 0 && (t2 = t2.slice(1), fc.exec(t2) && [3, 6, 9, 12].includes(t2.length))) {
    let e = t2.length / 3, i = [0, 0, 0];
    for (let r = 0; r < 3; ++r) {
      let n = parseInt(t2.slice(e * r, e * r + e), 16);
      i[r] = e === 1 ? n << 4 : e === 2 ? n : e === 3 ? n >> 4 : n >> 8;
    }
    return i;
  }
}
function Hs(s15, t2) {
  let e = s15.toString(16), i = e.length < 2 ? "0" + e : e;
  switch (t2) {
    case 4:
      return e[0];
    case 8:
      return i;
    case 12:
      return (i + i).slice(0, 3);
    default:
      return i + i;
  }
}
function ml(s15, t2 = 16) {
  let [e, i, r] = s15;
  return `rgb:${Hs(e, t2)}/${Hs(i, t2)}/${Hs(r, t2)}`;
}
var mc = { "(": 0, ")": 1, "*": 2, "+": 3, "-": 1, ".": 2 };
var ut = 131072;
var _l = 10;
function bl(s15, t2) {
  if (s15 > 24) return t2.setWinLines || false;
  switch (s15) {
    case 1:
      return !!t2.restoreWin;
    case 2:
      return !!t2.minimizeWin;
    case 3:
      return !!t2.setWinPosition;
    case 4:
      return !!t2.setWinSizePixels;
    case 5:
      return !!t2.raiseWin;
    case 6:
      return !!t2.lowerWin;
    case 7:
      return !!t2.refreshWin;
    case 8:
      return !!t2.setWinSizeChars;
    case 9:
      return !!t2.maximizeWin;
    case 10:
      return !!t2.fullscreenWin;
    case 11:
      return !!t2.getWinState;
    case 13:
      return !!t2.getWinPosition;
    case 14:
      return !!t2.getWinSizePixels;
    case 15:
      return !!t2.getScreenSizePixels;
    case 16:
      return !!t2.getCellSizePixels;
    case 18:
      return !!t2.getWinSizeChars;
    case 19:
      return !!t2.getScreenSizeChars;
    case 20:
      return !!t2.getIconTitle;
    case 21:
      return !!t2.getWinTitle;
    case 22:
      return !!t2.pushTitle;
    case 23:
      return !!t2.popTitle;
    case 24:
      return !!t2.setWinLines;
  }
  return false;
}
var vl = 5e3;
var gl = 0;
var vn = class extends D {
  constructor(e, i, r, n, o2, l, a, u, h2 = new bn()) {
    super();
    this._bufferService = e;
    this._charsetService = i;
    this._coreService = r;
    this._logService = n;
    this._optionsService = o2;
    this._oscLinkService = l;
    this._coreMouseService = a;
    this._unicodeService = u;
    this._parser = h2;
    this._parseBuffer = new Uint32Array(4096);
    this._stringDecoder = new er();
    this._utf8Decoder = new tr();
    this._windowTitle = "";
    this._iconName = "";
    this._windowTitleStack = [];
    this._iconNameStack = [];
    this._curAttrData = X.clone();
    this._eraseAttrDataInternal = X.clone();
    this._onRequestBell = this._register(new v());
    this.onRequestBell = this._onRequestBell.event;
    this._onRequestRefreshRows = this._register(new v());
    this.onRequestRefreshRows = this._onRequestRefreshRows.event;
    this._onRequestReset = this._register(new v());
    this.onRequestReset = this._onRequestReset.event;
    this._onRequestSendFocus = this._register(new v());
    this.onRequestSendFocus = this._onRequestSendFocus.event;
    this._onRequestSyncScrollBar = this._register(new v());
    this.onRequestSyncScrollBar = this._onRequestSyncScrollBar.event;
    this._onRequestWindowsOptionsReport = this._register(new v());
    this.onRequestWindowsOptionsReport = this._onRequestWindowsOptionsReport.event;
    this._onA11yChar = this._register(new v());
    this.onA11yChar = this._onA11yChar.event;
    this._onA11yTab = this._register(new v());
    this.onA11yTab = this._onA11yTab.event;
    this._onCursorMove = this._register(new v());
    this.onCursorMove = this._onCursorMove.event;
    this._onLineFeed = this._register(new v());
    this.onLineFeed = this._onLineFeed.event;
    this._onScroll = this._register(new v());
    this.onScroll = this._onScroll.event;
    this._onTitleChange = this._register(new v());
    this.onTitleChange = this._onTitleChange.event;
    this._onColor = this._register(new v());
    this.onColor = this._onColor.event;
    this._parseStack = { paused: false, cursorStartX: 0, cursorStartY: 0, decodedLength: 0, position: 0 };
    this._specialColors = [256, 257, 258];
    this._register(this._parser), this._dirtyRowTracker = new Zi(this._bufferService), this._activeBuffer = this._bufferService.buffer, this._register(this._bufferService.buffers.onBufferActivate((c) => this._activeBuffer = c.activeBuffer)), this._parser.setCsiHandlerFallback((c, d) => {
      this._logService.debug("Unknown CSI code: ", { identifier: this._parser.identToString(c), params: d.toArray() });
    }), this._parser.setEscHandlerFallback((c) => {
      this._logService.debug("Unknown ESC code: ", { identifier: this._parser.identToString(c) });
    }), this._parser.setExecuteHandlerFallback((c) => {
      this._logService.debug("Unknown EXECUTE code: ", { code: c });
    }), this._parser.setOscHandlerFallback((c, d, _2) => {
      this._logService.debug("Unknown OSC code: ", { identifier: c, action: d, data: _2 });
    }), this._parser.setDcsHandlerFallback((c, d, _2) => {
      d === "HOOK" && (_2 = _2.toArray()), this._logService.debug("Unknown DCS code: ", { identifier: this._parser.identToString(c), action: d, payload: _2 });
    }), this._parser.setPrintHandler((c, d, _2) => this.print(c, d, _2)), this._parser.registerCsiHandler({ final: "@" }, (c) => this.insertChars(c)), this._parser.registerCsiHandler({ intermediates: " ", final: "@" }, (c) => this.scrollLeft(c)), this._parser.registerCsiHandler({ final: "A" }, (c) => this.cursorUp(c)), this._parser.registerCsiHandler({ intermediates: " ", final: "A" }, (c) => this.scrollRight(c)), this._parser.registerCsiHandler({ final: "B" }, (c) => this.cursorDown(c)), this._parser.registerCsiHandler({ final: "C" }, (c) => this.cursorForward(c)), this._parser.registerCsiHandler({ final: "D" }, (c) => this.cursorBackward(c)), this._parser.registerCsiHandler({ final: "E" }, (c) => this.cursorNextLine(c)), this._parser.registerCsiHandler({ final: "F" }, (c) => this.cursorPrecedingLine(c)), this._parser.registerCsiHandler({ final: "G" }, (c) => this.cursorCharAbsolute(c)), this._parser.registerCsiHandler({ final: "H" }, (c) => this.cursorPosition(c)), this._parser.registerCsiHandler({ final: "I" }, (c) => this.cursorForwardTab(c)), this._parser.registerCsiHandler({ final: "J" }, (c) => this.eraseInDisplay(c, false)), this._parser.registerCsiHandler({ prefix: "?", final: "J" }, (c) => this.eraseInDisplay(c, true)), this._parser.registerCsiHandler({ final: "K" }, (c) => this.eraseInLine(c, false)), this._parser.registerCsiHandler({ prefix: "?", final: "K" }, (c) => this.eraseInLine(c, true)), this._parser.registerCsiHandler({ final: "L" }, (c) => this.insertLines(c)), this._parser.registerCsiHandler({ final: "M" }, (c) => this.deleteLines(c)), this._parser.registerCsiHandler({ final: "P" }, (c) => this.deleteChars(c)), this._parser.registerCsiHandler({ final: "S" }, (c) => this.scrollUp(c)), this._parser.registerCsiHandler({ final: "T" }, (c) => this.scrollDown(c)), this._parser.registerCsiHandler({ final: "X" }, (c) => this.eraseChars(c)), this._parser.registerCsiHandler({ final: "Z" }, (c) => this.cursorBackwardTab(c)), this._parser.registerCsiHandler({ final: "`" }, (c) => this.charPosAbsolute(c)), this._parser.registerCsiHandler({ final: "a" }, (c) => this.hPositionRelative(c)), this._parser.registerCsiHandler({ final: "b" }, (c) => this.repeatPrecedingCharacter(c)), this._parser.registerCsiHandler({ final: "c" }, (c) => this.sendDeviceAttributesPrimary(c)), this._parser.registerCsiHandler({ prefix: ">", final: "c" }, (c) => this.sendDeviceAttributesSecondary(c)), this._parser.registerCsiHandler({ final: "d" }, (c) => this.linePosAbsolute(c)), this._parser.registerCsiHandler({ final: "e" }, (c) => this.vPositionRelative(c)), this._parser.registerCsiHandler({ final: "f" }, (c) => this.hVPosition(c)), this._parser.registerCsiHandler({ final: "g" }, (c) => this.tabClear(c)), this._parser.registerCsiHandler({ final: "h" }, (c) => this.setMode(c)), this._parser.registerCsiHandler({ prefix: "?", final: "h" }, (c) => this.setModePrivate(c)), this._parser.registerCsiHandler({ final: "l" }, (c) => this.resetMode(c)), this._parser.registerCsiHandler({ prefix: "?", final: "l" }, (c) => this.resetModePrivate(c)), this._parser.registerCsiHandler({ final: "m" }, (c) => this.charAttributes(c)), this._parser.registerCsiHandler({ final: "n" }, (c) => this.deviceStatus(c)), this._parser.registerCsiHandler({ prefix: "?", final: "n" }, (c) => this.deviceStatusPrivate(c)), this._parser.registerCsiHandler({ intermediates: "!", final: "p" }, (c) => this.softReset(c)), this._parser.registerCsiHandler({ intermediates: " ", final: "q" }, (c) => this.setCursorStyle(c)), this._parser.registerCsiHandler({ final: "r" }, (c) => this.setScrollRegion(c)), this._parser.registerCsiHandler({ final: "s" }, (c) => this.saveCursor(c)), this._parser.registerCsiHandler({ final: "t" }, (c) => this.windowOptions(c)), this._parser.registerCsiHandler({ final: "u" }, (c) => this.restoreCursor(c)), this._parser.registerCsiHandler({ intermediates: "'", final: "}" }, (c) => this.insertColumns(c)), this._parser.registerCsiHandler({ intermediates: "'", final: "~" }, (c) => this.deleteColumns(c)), this._parser.registerCsiHandler({ intermediates: '"', final: "q" }, (c) => this.selectProtected(c)), this._parser.registerCsiHandler({ intermediates: "$", final: "p" }, (c) => this.requestMode(c, true)), this._parser.registerCsiHandler({ prefix: "?", intermediates: "$", final: "p" }, (c) => this.requestMode(c, false)), this._parser.setExecuteHandler(b.BEL, () => this.bell()), this._parser.setExecuteHandler(b.LF, () => this.lineFeed()), this._parser.setExecuteHandler(b.VT, () => this.lineFeed()), this._parser.setExecuteHandler(b.FF, () => this.lineFeed()), this._parser.setExecuteHandler(b.CR, () => this.carriageReturn()), this._parser.setExecuteHandler(b.BS, () => this.backspace()), this._parser.setExecuteHandler(b.HT, () => this.tab()), this._parser.setExecuteHandler(b.SO, () => this.shiftOut()), this._parser.setExecuteHandler(b.SI, () => this.shiftIn()), this._parser.setExecuteHandler(Ai.IND, () => this.index()), this._parser.setExecuteHandler(Ai.NEL, () => this.nextLine()), this._parser.setExecuteHandler(Ai.HTS, () => this.tabSet()), this._parser.registerOscHandler(0, new pe((c) => (this.setTitle(c), this.setIconName(c), true))), this._parser.registerOscHandler(1, new pe((c) => this.setIconName(c))), this._parser.registerOscHandler(2, new pe((c) => this.setTitle(c))), this._parser.registerOscHandler(4, new pe((c) => this.setOrReportIndexedColor(c))), this._parser.registerOscHandler(8, new pe((c) => this.setHyperlink(c))), this._parser.registerOscHandler(10, new pe((c) => this.setOrReportFgColor(c))), this._parser.registerOscHandler(11, new pe((c) => this.setOrReportBgColor(c))), this._parser.registerOscHandler(12, new pe((c) => this.setOrReportCursorColor(c))), this._parser.registerOscHandler(104, new pe((c) => this.restoreIndexedColor(c))), this._parser.registerOscHandler(110, new pe((c) => this.restoreFgColor(c))), this._parser.registerOscHandler(111, new pe((c) => this.restoreBgColor(c))), this._parser.registerOscHandler(112, new pe((c) => this.restoreCursorColor(c))), this._parser.registerEscHandler({ final: "7" }, () => this.saveCursor()), this._parser.registerEscHandler({ final: "8" }, () => this.restoreCursor()), this._parser.registerEscHandler({ final: "D" }, () => this.index()), this._parser.registerEscHandler({ final: "E" }, () => this.nextLine()), this._parser.registerEscHandler({ final: "H" }, () => this.tabSet()), this._parser.registerEscHandler({ final: "M" }, () => this.reverseIndex()), this._parser.registerEscHandler({ final: "=" }, () => this.keypadApplicationMode()), this._parser.registerEscHandler({ final: ">" }, () => this.keypadNumericMode()), this._parser.registerEscHandler({ final: "c" }, () => this.fullReset()), this._parser.registerEscHandler({ final: "n" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "o" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "|" }, () => this.setgLevel(3)), this._parser.registerEscHandler({ final: "}" }, () => this.setgLevel(2)), this._parser.registerEscHandler({ final: "~" }, () => this.setgLevel(1)), this._parser.registerEscHandler({ intermediates: "%", final: "@" }, () => this.selectDefaultCharset()), this._parser.registerEscHandler({ intermediates: "%", final: "G" }, () => this.selectDefaultCharset());
    for (let c in ne) this._parser.registerEscHandler({ intermediates: "(", final: c }, () => this.selectCharset("(" + c)), this._parser.registerEscHandler({ intermediates: ")", final: c }, () => this.selectCharset(")" + c)), this._parser.registerEscHandler({ intermediates: "*", final: c }, () => this.selectCharset("*" + c)), this._parser.registerEscHandler({ intermediates: "+", final: c }, () => this.selectCharset("+" + c)), this._parser.registerEscHandler({ intermediates: "-", final: c }, () => this.selectCharset("-" + c)), this._parser.registerEscHandler({ intermediates: ".", final: c }, () => this.selectCharset("." + c)), this._parser.registerEscHandler({ intermediates: "/", final: c }, () => this.selectCharset("/" + c));
    this._parser.registerEscHandler({ intermediates: "#", final: "8" }, () => this.screenAlignmentPattern()), this._parser.setErrorHandler((c) => (this._logService.error("Parsing error: ", c), c)), this._parser.registerDcsHandler({ intermediates: "$", final: "q" }, new Xi((c, d) => this.requestStatusString(c, d)));
  }
  getAttrData() {
    return this._curAttrData;
  }
  _preserveStack(e, i, r, n) {
    this._parseStack.paused = true, this._parseStack.cursorStartX = e, this._parseStack.cursorStartY = i, this._parseStack.decodedLength = r, this._parseStack.position = n;
  }
  _logSlowResolvingAsync(e) {
    this._logService.logLevel <= 3 && Promise.race([e, new Promise((i, r) => setTimeout(() => r("#SLOW_TIMEOUT"), vl))]).catch((i) => {
      if (i !== "#SLOW_TIMEOUT") throw i;
      console.warn(`async parser handler taking longer than ${vl} ms`);
    });
  }
  _getCurrentLinkId() {
    return this._curAttrData.extended.urlId;
  }
  parse(e, i) {
    let r, n = this._activeBuffer.x, o2 = this._activeBuffer.y, l = 0, a = this._parseStack.paused;
    if (a) {
      if (r = this._parser.parse(this._parseBuffer, this._parseStack.decodedLength, i)) return this._logSlowResolvingAsync(r), r;
      n = this._parseStack.cursorStartX, o2 = this._parseStack.cursorStartY, this._parseStack.paused = false, e.length > ut && (l = this._parseStack.position + ut);
    }
    if (this._logService.logLevel <= 1 && this._logService.debug(`parsing data ${typeof e == "string" ? ` "${e}"` : ` "${Array.prototype.map.call(e, (c) => String.fromCharCode(c)).join("")}"`}`), this._logService.logLevel === 0 && this._logService.trace("parsing data (codes)", typeof e == "string" ? e.split("").map((c) => c.charCodeAt(0)) : e), this._parseBuffer.length < e.length && this._parseBuffer.length < ut && (this._parseBuffer = new Uint32Array(Math.min(e.length, ut))), a || this._dirtyRowTracker.clearRange(), e.length > ut) for (let c = l; c < e.length; c += ut) {
      let d = c + ut < e.length ? c + ut : e.length, _2 = typeof e == "string" ? this._stringDecoder.decode(e.substring(c, d), this._parseBuffer) : this._utf8Decoder.decode(e.subarray(c, d), this._parseBuffer);
      if (r = this._parser.parse(this._parseBuffer, _2)) return this._preserveStack(n, o2, _2, c), this._logSlowResolvingAsync(r), r;
    }
    else if (!a) {
      let c = typeof e == "string" ? this._stringDecoder.decode(e, this._parseBuffer) : this._utf8Decoder.decode(e, this._parseBuffer);
      if (r = this._parser.parse(this._parseBuffer, c)) return this._preserveStack(n, o2, c, 0), this._logSlowResolvingAsync(r), r;
    }
    (this._activeBuffer.x !== n || this._activeBuffer.y !== o2) && this._onCursorMove.fire();
    let u = this._dirtyRowTracker.end + (this._bufferService.buffer.ybase - this._bufferService.buffer.ydisp), h2 = this._dirtyRowTracker.start + (this._bufferService.buffer.ybase - this._bufferService.buffer.ydisp);
    h2 < this._bufferService.rows && this._onRequestRefreshRows.fire({ start: Math.min(h2, this._bufferService.rows - 1), end: Math.min(u, this._bufferService.rows - 1) });
  }
  print(e, i, r) {
    let n, o2, l = this._charsetService.charset, a = this._optionsService.rawOptions.screenReaderMode, u = this._bufferService.cols, h2 = this._coreService.decPrivateModes.wraparound, c = this._coreService.modes.insertMode, d = this._curAttrData, _2 = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
    this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._activeBuffer.x && r - i > 0 && _2.getWidth(this._activeBuffer.x - 1) === 2 && _2.setCellFromCodepoint(this._activeBuffer.x - 1, 0, 1, d);
    let p = this._parser.precedingJoinState;
    for (let m = i; m < r; ++m) {
      if (n = e[m], n < 127 && l) {
        let O = l[String.fromCharCode(n)];
        O && (n = O.charCodeAt(0));
      }
      let f = this._unicodeService.charProperties(n, p);
      o2 = Ae.extractWidth(f);
      let A = Ae.extractShouldJoin(f), R = A ? Ae.extractWidth(p) : 0;
      if (p = f, a && this._onA11yChar.fire(Ce(n)), this._getCurrentLinkId() && this._oscLinkService.addLineToLink(this._getCurrentLinkId(), this._activeBuffer.ybase + this._activeBuffer.y), this._activeBuffer.x + o2 - R > u) {
        if (h2) {
          let O = _2, I = this._activeBuffer.x - R;
          for (this._activeBuffer.x = R, this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData(), true)) : (this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1), this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = true), _2 = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y), R > 0 && _2 instanceof Ze && _2.copyCellsFrom(O, I, 0, R, false); I < u; ) O.setCellFromCodepoint(I++, 0, 1, d);
        } else if (this._activeBuffer.x = u - 1, o2 === 2) continue;
      }
      if (A && this._activeBuffer.x) {
        let O = _2.getWidth(this._activeBuffer.x - 1) ? 1 : 2;
        _2.addCodepointToCell(this._activeBuffer.x - O, n, o2);
        for (let I = o2 - R; --I >= 0; ) _2.setCellFromCodepoint(this._activeBuffer.x++, 0, 0, d);
        continue;
      }
      if (c && (_2.insertCells(this._activeBuffer.x, o2 - R, this._activeBuffer.getNullCell(d)), _2.getWidth(u - 1) === 2 && _2.setCellFromCodepoint(u - 1, 0, 1, d)), _2.setCellFromCodepoint(this._activeBuffer.x++, n, o2, d), o2 > 0) for (; --o2; ) _2.setCellFromCodepoint(this._activeBuffer.x++, 0, 0, d);
    }
    this._parser.precedingJoinState = p, this._activeBuffer.x < u && r - i > 0 && _2.getWidth(this._activeBuffer.x) === 0 && !_2.hasContent(this._activeBuffer.x) && _2.setCellFromCodepoint(this._activeBuffer.x, 0, 1, d), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
  }
  registerCsiHandler(e, i) {
    return e.final === "t" && !e.prefix && !e.intermediates ? this._parser.registerCsiHandler(e, (r) => bl(r.params[0], this._optionsService.rawOptions.windowOptions) ? i(r) : true) : this._parser.registerCsiHandler(e, i);
  }
  registerDcsHandler(e, i) {
    return this._parser.registerDcsHandler(e, new Xi(i));
  }
  registerEscHandler(e, i) {
    return this._parser.registerEscHandler(e, i);
  }
  registerOscHandler(e, i) {
    return this._parser.registerOscHandler(e, new pe(i));
  }
  bell() {
    return this._onRequestBell.fire(), true;
  }
  lineFeed() {
    return this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._optionsService.rawOptions.convertEol && (this._activeBuffer.x = 0), this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData())) : this._activeBuffer.y >= this._bufferService.rows ? this._activeBuffer.y = this._bufferService.rows - 1 : this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = false, this._activeBuffer.x >= this._bufferService.cols && this._activeBuffer.x--, this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._onLineFeed.fire(), true;
  }
  carriageReturn() {
    return this._activeBuffer.x = 0, true;
  }
  backspace() {
    if (!this._coreService.decPrivateModes.reverseWraparound) return this._restrictCursor(), this._activeBuffer.x > 0 && this._activeBuffer.x--, true;
    if (this._restrictCursor(this._bufferService.cols), this._activeBuffer.x > 0) this._activeBuffer.x--;
    else if (this._activeBuffer.x === 0 && this._activeBuffer.y > this._activeBuffer.scrollTop && this._activeBuffer.y <= this._activeBuffer.scrollBottom && this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y)?.isWrapped) {
      this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = false, this._activeBuffer.y--, this._activeBuffer.x = this._bufferService.cols - 1;
      let e = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
      e.hasWidth(this._activeBuffer.x) && !e.hasContent(this._activeBuffer.x) && this._activeBuffer.x--;
    }
    return this._restrictCursor(), true;
  }
  tab() {
    if (this._activeBuffer.x >= this._bufferService.cols) return true;
    let e = this._activeBuffer.x;
    return this._activeBuffer.x = this._activeBuffer.nextStop(), this._optionsService.rawOptions.screenReaderMode && this._onA11yTab.fire(this._activeBuffer.x - e), true;
  }
  shiftOut() {
    return this._charsetService.setgLevel(1), true;
  }
  shiftIn() {
    return this._charsetService.setgLevel(0), true;
  }
  _restrictCursor(e = this._bufferService.cols - 1) {
    this._activeBuffer.x = Math.min(e, Math.max(0, this._activeBuffer.x)), this._activeBuffer.y = this._coreService.decPrivateModes.origin ? Math.min(this._activeBuffer.scrollBottom, Math.max(this._activeBuffer.scrollTop, this._activeBuffer.y)) : Math.min(this._bufferService.rows - 1, Math.max(0, this._activeBuffer.y)), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
  }
  _setCursor(e, i) {
    this._dirtyRowTracker.markDirty(this._activeBuffer.y), this._coreService.decPrivateModes.origin ? (this._activeBuffer.x = e, this._activeBuffer.y = this._activeBuffer.scrollTop + i) : (this._activeBuffer.x = e, this._activeBuffer.y = i), this._restrictCursor(), this._dirtyRowTracker.markDirty(this._activeBuffer.y);
  }
  _moveCursor(e, i) {
    this._restrictCursor(), this._setCursor(this._activeBuffer.x + e, this._activeBuffer.y + i);
  }
  cursorUp(e) {
    let i = this._activeBuffer.y - this._activeBuffer.scrollTop;
    return i >= 0 ? this._moveCursor(0, -Math.min(i, e.params[0] || 1)) : this._moveCursor(0, -(e.params[0] || 1)), true;
  }
  cursorDown(e) {
    let i = this._activeBuffer.scrollBottom - this._activeBuffer.y;
    return i >= 0 ? this._moveCursor(0, Math.min(i, e.params[0] || 1)) : this._moveCursor(0, e.params[0] || 1), true;
  }
  cursorForward(e) {
    return this._moveCursor(e.params[0] || 1, 0), true;
  }
  cursorBackward(e) {
    return this._moveCursor(-(e.params[0] || 1), 0), true;
  }
  cursorNextLine(e) {
    return this.cursorDown(e), this._activeBuffer.x = 0, true;
  }
  cursorPrecedingLine(e) {
    return this.cursorUp(e), this._activeBuffer.x = 0, true;
  }
  cursorCharAbsolute(e) {
    return this._setCursor((e.params[0] || 1) - 1, this._activeBuffer.y), true;
  }
  cursorPosition(e) {
    return this._setCursor(e.length >= 2 ? (e.params[1] || 1) - 1 : 0, (e.params[0] || 1) - 1), true;
  }
  charPosAbsolute(e) {
    return this._setCursor((e.params[0] || 1) - 1, this._activeBuffer.y), true;
  }
  hPositionRelative(e) {
    return this._moveCursor(e.params[0] || 1, 0), true;
  }
  linePosAbsolute(e) {
    return this._setCursor(this._activeBuffer.x, (e.params[0] || 1) - 1), true;
  }
  vPositionRelative(e) {
    return this._moveCursor(0, e.params[0] || 1), true;
  }
  hVPosition(e) {
    return this.cursorPosition(e), true;
  }
  tabClear(e) {
    let i = e.params[0];
    return i === 0 ? delete this._activeBuffer.tabs[this._activeBuffer.x] : i === 3 && (this._activeBuffer.tabs = {}), true;
  }
  cursorForwardTab(e) {
    if (this._activeBuffer.x >= this._bufferService.cols) return true;
    let i = e.params[0] || 1;
    for (; i--; ) this._activeBuffer.x = this._activeBuffer.nextStop();
    return true;
  }
  cursorBackwardTab(e) {
    if (this._activeBuffer.x >= this._bufferService.cols) return true;
    let i = e.params[0] || 1;
    for (; i--; ) this._activeBuffer.x = this._activeBuffer.prevStop();
    return true;
  }
  selectProtected(e) {
    let i = e.params[0];
    return i === 1 && (this._curAttrData.bg |= 536870912), (i === 2 || i === 0) && (this._curAttrData.bg &= -536870913), true;
  }
  _eraseInBufferLine(e, i, r, n = false, o2 = false) {
    let l = this._activeBuffer.lines.get(this._activeBuffer.ybase + e);
    l.replaceCells(i, r, this._activeBuffer.getNullCell(this._eraseAttrData()), o2), n && (l.isWrapped = false);
  }
  _resetBufferLine(e, i = false) {
    let r = this._activeBuffer.lines.get(this._activeBuffer.ybase + e);
    r && (r.fill(this._activeBuffer.getNullCell(this._eraseAttrData()), i), this._bufferService.buffer.clearMarkers(this._activeBuffer.ybase + e), r.isWrapped = false);
  }
  eraseInDisplay(e, i = false) {
    this._restrictCursor(this._bufferService.cols);
    let r;
    switch (e.params[0]) {
      case 0:
        for (r = this._activeBuffer.y, this._dirtyRowTracker.markDirty(r), this._eraseInBufferLine(r++, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, i); r < this._bufferService.rows; r++) this._resetBufferLine(r, i);
        this._dirtyRowTracker.markDirty(r);
        break;
      case 1:
        for (r = this._activeBuffer.y, this._dirtyRowTracker.markDirty(r), this._eraseInBufferLine(r, 0, this._activeBuffer.x + 1, true, i), this._activeBuffer.x + 1 >= this._bufferService.cols && (this._activeBuffer.lines.get(r + 1).isWrapped = false); r--; ) this._resetBufferLine(r, i);
        this._dirtyRowTracker.markDirty(0);
        break;
      case 2:
        if (this._optionsService.rawOptions.scrollOnEraseInDisplay) {
          for (r = this._bufferService.rows, this._dirtyRowTracker.markRangeDirty(0, r - 1); r-- && !this._activeBuffer.lines.get(this._activeBuffer.ybase + r)?.getTrimmedLength(); ) ;
          for (; r >= 0; r--) this._bufferService.scroll(this._eraseAttrData());
        } else {
          for (r = this._bufferService.rows, this._dirtyRowTracker.markDirty(r - 1); r--; ) this._resetBufferLine(r, i);
          this._dirtyRowTracker.markDirty(0);
        }
        break;
      case 3:
        let n = this._activeBuffer.lines.length - this._bufferService.rows;
        n > 0 && (this._activeBuffer.lines.trimStart(n), this._activeBuffer.ybase = Math.max(this._activeBuffer.ybase - n, 0), this._activeBuffer.ydisp = Math.max(this._activeBuffer.ydisp - n, 0), this._onScroll.fire(0));
        break;
    }
    return true;
  }
  eraseInLine(e, i = false) {
    switch (this._restrictCursor(this._bufferService.cols), e.params[0]) {
      case 0:
        this._eraseInBufferLine(this._activeBuffer.y, this._activeBuffer.x, this._bufferService.cols, this._activeBuffer.x === 0, i);
        break;
      case 1:
        this._eraseInBufferLine(this._activeBuffer.y, 0, this._activeBuffer.x + 1, false, i);
        break;
      case 2:
        this._eraseInBufferLine(this._activeBuffer.y, 0, this._bufferService.cols, true, i);
        break;
    }
    return this._dirtyRowTracker.markDirty(this._activeBuffer.y), true;
  }
  insertLines(e) {
    this._restrictCursor();
    let i = e.params[0] || 1;
    if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return true;
    let r = this._activeBuffer.ybase + this._activeBuffer.y, n = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, o2 = this._bufferService.rows - 1 + this._activeBuffer.ybase - n + 1;
    for (; i--; ) this._activeBuffer.lines.splice(o2 - 1, 1), this._activeBuffer.lines.splice(r, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, true;
  }
  deleteLines(e) {
    this._restrictCursor();
    let i = e.params[0] || 1;
    if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return true;
    let r = this._activeBuffer.ybase + this._activeBuffer.y, n;
    for (n = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom, n = this._bufferService.rows - 1 + this._activeBuffer.ybase - n; i--; ) this._activeBuffer.lines.splice(r, 1), this._activeBuffer.lines.splice(n, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom), this._activeBuffer.x = 0, true;
  }
  insertChars(e) {
    this._restrictCursor();
    let i = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
    return i && (i.insertCells(this._activeBuffer.x, e.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData())), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), true;
  }
  deleteChars(e) {
    this._restrictCursor();
    let i = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
    return i && (i.deleteCells(this._activeBuffer.x, e.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData())), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), true;
  }
  scrollUp(e) {
    let i = e.params[0] || 1;
    for (; i--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), true;
  }
  scrollDown(e) {
    let i = e.params[0] || 1;
    for (; i--; ) this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 1), this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 0, this._activeBuffer.getBlankLine(X));
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), true;
  }
  scrollLeft(e) {
    if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return true;
    let i = e.params[0] || 1;
    for (let r = this._activeBuffer.scrollTop; r <= this._activeBuffer.scrollBottom; ++r) {
      let n = this._activeBuffer.lines.get(this._activeBuffer.ybase + r);
      n.deleteCells(0, i, this._activeBuffer.getNullCell(this._eraseAttrData())), n.isWrapped = false;
    }
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), true;
  }
  scrollRight(e) {
    if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return true;
    let i = e.params[0] || 1;
    for (let r = this._activeBuffer.scrollTop; r <= this._activeBuffer.scrollBottom; ++r) {
      let n = this._activeBuffer.lines.get(this._activeBuffer.ybase + r);
      n.insertCells(0, i, this._activeBuffer.getNullCell(this._eraseAttrData())), n.isWrapped = false;
    }
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), true;
  }
  insertColumns(e) {
    if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return true;
    let i = e.params[0] || 1;
    for (let r = this._activeBuffer.scrollTop; r <= this._activeBuffer.scrollBottom; ++r) {
      let n = this._activeBuffer.lines.get(this._activeBuffer.ybase + r);
      n.insertCells(this._activeBuffer.x, i, this._activeBuffer.getNullCell(this._eraseAttrData())), n.isWrapped = false;
    }
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), true;
  }
  deleteColumns(e) {
    if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop) return true;
    let i = e.params[0] || 1;
    for (let r = this._activeBuffer.scrollTop; r <= this._activeBuffer.scrollBottom; ++r) {
      let n = this._activeBuffer.lines.get(this._activeBuffer.ybase + r);
      n.deleteCells(this._activeBuffer.x, i, this._activeBuffer.getNullCell(this._eraseAttrData())), n.isWrapped = false;
    }
    return this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom), true;
  }
  eraseChars(e) {
    this._restrictCursor();
    let i = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
    return i && (i.replaceCells(this._activeBuffer.x, this._activeBuffer.x + (e.params[0] || 1), this._activeBuffer.getNullCell(this._eraseAttrData())), this._dirtyRowTracker.markDirty(this._activeBuffer.y)), true;
  }
  repeatPrecedingCharacter(e) {
    let i = this._parser.precedingJoinState;
    if (!i) return true;
    let r = e.params[0] || 1, n = Ae.extractWidth(i), o2 = this._activeBuffer.x - n, a = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).getString(o2), u = new Uint32Array(a.length * r), h2 = 0;
    for (let d = 0; d < a.length; ) {
      let _2 = a.codePointAt(d) || 0;
      u[h2++] = _2, d += _2 > 65535 ? 2 : 1;
    }
    let c = h2;
    for (let d = 1; d < r; ++d) u.copyWithin(c, 0, h2), c += h2;
    return this.print(u, 0, c), true;
  }
  sendDeviceAttributesPrimary(e) {
    return e.params[0] > 0 || (this._is("xterm") || this._is("rxvt-unicode") || this._is("screen") ? this._coreService.triggerDataEvent(b.ESC + "[?1;2c") : this._is("linux") && this._coreService.triggerDataEvent(b.ESC + "[?6c")), true;
  }
  sendDeviceAttributesSecondary(e) {
    return e.params[0] > 0 || (this._is("xterm") ? this._coreService.triggerDataEvent(b.ESC + "[>0;276;0c") : this._is("rxvt-unicode") ? this._coreService.triggerDataEvent(b.ESC + "[>85;95;0c") : this._is("linux") ? this._coreService.triggerDataEvent(e.params[0] + "c") : this._is("screen") && this._coreService.triggerDataEvent(b.ESC + "[>83;40003;0c")), true;
  }
  _is(e) {
    return (this._optionsService.rawOptions.termName + "").indexOf(e) === 0;
  }
  setMode(e) {
    for (let i = 0; i < e.length; i++) switch (e.params[i]) {
      case 4:
        this._coreService.modes.insertMode = true;
        break;
      case 20:
        this._optionsService.options.convertEol = true;
        break;
    }
    return true;
  }
  setModePrivate(e) {
    for (let i = 0; i < e.length; i++) switch (e.params[i]) {
      case 1:
        this._coreService.decPrivateModes.applicationCursorKeys = true;
        break;
      case 2:
        this._charsetService.setgCharset(0, Je), this._charsetService.setgCharset(1, Je), this._charsetService.setgCharset(2, Je), this._charsetService.setgCharset(3, Je);
        break;
      case 3:
        this._optionsService.rawOptions.windowOptions.setWinLines && (this._bufferService.resize(132, this._bufferService.rows), this._onRequestReset.fire());
        break;
      case 6:
        this._coreService.decPrivateModes.origin = true, this._setCursor(0, 0);
        break;
      case 7:
        this._coreService.decPrivateModes.wraparound = true;
        break;
      case 12:
        this._optionsService.options.cursorBlink = true;
        break;
      case 45:
        this._coreService.decPrivateModes.reverseWraparound = true;
        break;
      case 66:
        this._logService.debug("Serial port requested application keypad."), this._coreService.decPrivateModes.applicationKeypad = true, this._onRequestSyncScrollBar.fire();
        break;
      case 9:
        this._coreMouseService.activeProtocol = "X10";
        break;
      case 1e3:
        this._coreMouseService.activeProtocol = "VT200";
        break;
      case 1002:
        this._coreMouseService.activeProtocol = "DRAG";
        break;
      case 1003:
        this._coreMouseService.activeProtocol = "ANY";
        break;
      case 1004:
        this._coreService.decPrivateModes.sendFocus = true, this._onRequestSendFocus.fire();
        break;
      case 1005:
        this._logService.debug("DECSET 1005 not supported (see #2507)");
        break;
      case 1006:
        this._coreMouseService.activeEncoding = "SGR";
        break;
      case 1015:
        this._logService.debug("DECSET 1015 not supported (see #2507)");
        break;
      case 1016:
        this._coreMouseService.activeEncoding = "SGR_PIXELS";
        break;
      case 25:
        this._coreService.isCursorHidden = false;
        break;
      case 1048:
        this.saveCursor();
        break;
      case 1049:
        this.saveCursor();
      case 47:
      case 1047:
        this._bufferService.buffers.activateAltBuffer(this._eraseAttrData()), this._coreService.isCursorInitialized = true, this._onRequestRefreshRows.fire(void 0), this._onRequestSyncScrollBar.fire();
        break;
      case 2004:
        this._coreService.decPrivateModes.bracketedPasteMode = true;
        break;
      case 2026:
        this._coreService.decPrivateModes.synchronizedOutput = true;
        break;
    }
    return true;
  }
  resetMode(e) {
    for (let i = 0; i < e.length; i++) switch (e.params[i]) {
      case 4:
        this._coreService.modes.insertMode = false;
        break;
      case 20:
        this._optionsService.options.convertEol = false;
        break;
    }
    return true;
  }
  resetModePrivate(e) {
    for (let i = 0; i < e.length; i++) switch (e.params[i]) {
      case 1:
        this._coreService.decPrivateModes.applicationCursorKeys = false;
        break;
      case 3:
        this._optionsService.rawOptions.windowOptions.setWinLines && (this._bufferService.resize(80, this._bufferService.rows), this._onRequestReset.fire());
        break;
      case 6:
        this._coreService.decPrivateModes.origin = false, this._setCursor(0, 0);
        break;
      case 7:
        this._coreService.decPrivateModes.wraparound = false;
        break;
      case 12:
        this._optionsService.options.cursorBlink = false;
        break;
      case 45:
        this._coreService.decPrivateModes.reverseWraparound = false;
        break;
      case 66:
        this._logService.debug("Switching back to normal keypad."), this._coreService.decPrivateModes.applicationKeypad = false, this._onRequestSyncScrollBar.fire();
        break;
      case 9:
      case 1e3:
      case 1002:
      case 1003:
        this._coreMouseService.activeProtocol = "NONE";
        break;
      case 1004:
        this._coreService.decPrivateModes.sendFocus = false;
        break;
      case 1005:
        this._logService.debug("DECRST 1005 not supported (see #2507)");
        break;
      case 1006:
        this._coreMouseService.activeEncoding = "DEFAULT";
        break;
      case 1015:
        this._logService.debug("DECRST 1015 not supported (see #2507)");
        break;
      case 1016:
        this._coreMouseService.activeEncoding = "DEFAULT";
        break;
      case 25:
        this._coreService.isCursorHidden = true;
        break;
      case 1048:
        this.restoreCursor();
        break;
      case 1049:
      case 47:
      case 1047:
        this._bufferService.buffers.activateNormalBuffer(), e.params[i] === 1049 && this.restoreCursor(), this._coreService.isCursorInitialized = true, this._onRequestRefreshRows.fire(void 0), this._onRequestSyncScrollBar.fire();
        break;
      case 2004:
        this._coreService.decPrivateModes.bracketedPasteMode = false;
        break;
      case 2026:
        this._coreService.decPrivateModes.synchronizedOutput = false, this._onRequestRefreshRows.fire(void 0);
        break;
    }
    return true;
  }
  requestMode(e, i) {
    let r;
    ((P) => (P[P.NOT_RECOGNIZED = 0] = "NOT_RECOGNIZED", P[P.SET = 1] = "SET", P[P.RESET = 2] = "RESET", P[P.PERMANENTLY_SET = 3] = "PERMANENTLY_SET", P[P.PERMANENTLY_RESET = 4] = "PERMANENTLY_RESET"))(r ||= {});
    let n = this._coreService.decPrivateModes, { activeProtocol: o2, activeEncoding: l } = this._coreMouseService, a = this._coreService, { buffers: u, cols: h2 } = this._bufferService, { active: c, alt: d } = u, _2 = this._optionsService.rawOptions, p = (A, R) => (a.triggerDataEvent(`${b.ESC}[${i ? "" : "?"}${A};${R}$y`), true), m = (A) => A ? 1 : 2, f = e.params[0];
    return i ? f === 2 ? p(f, 4) : f === 4 ? p(f, m(a.modes.insertMode)) : f === 12 ? p(f, 3) : f === 20 ? p(f, m(_2.convertEol)) : p(f, 0) : f === 1 ? p(f, m(n.applicationCursorKeys)) : f === 3 ? p(f, _2.windowOptions.setWinLines ? h2 === 80 ? 2 : h2 === 132 ? 1 : 0 : 0) : f === 6 ? p(f, m(n.origin)) : f === 7 ? p(f, m(n.wraparound)) : f === 8 ? p(f, 3) : f === 9 ? p(f, m(o2 === "X10")) : f === 12 ? p(f, m(_2.cursorBlink)) : f === 25 ? p(f, m(!a.isCursorHidden)) : f === 45 ? p(f, m(n.reverseWraparound)) : f === 66 ? p(f, m(n.applicationKeypad)) : f === 67 ? p(f, 4) : f === 1e3 ? p(f, m(o2 === "VT200")) : f === 1002 ? p(f, m(o2 === "DRAG")) : f === 1003 ? p(f, m(o2 === "ANY")) : f === 1004 ? p(f, m(n.sendFocus)) : f === 1005 ? p(f, 4) : f === 1006 ? p(f, m(l === "SGR")) : f === 1015 ? p(f, 4) : f === 1016 ? p(f, m(l === "SGR_PIXELS")) : f === 1048 ? p(f, 1) : f === 47 || f === 1047 || f === 1049 ? p(f, m(c === d)) : f === 2004 ? p(f, m(n.bracketedPasteMode)) : f === 2026 ? p(f, m(n.synchronizedOutput)) : p(f, 0);
  }
  _updateAttrColor(e, i, r, n, o2) {
    return i === 2 ? (e |= 50331648, e &= -16777216, e |= De.fromColorRGB([r, n, o2])) : i === 5 && (e &= -50331904, e |= 33554432 | r & 255), e;
  }
  _extractColor(e, i, r) {
    let n = [0, 0, -1, 0, 0, 0], o2 = 0, l = 0;
    do {
      if (n[l + o2] = e.params[i + l], e.hasSubParams(i + l)) {
        let a = e.getSubParams(i + l), u = 0;
        do
          n[1] === 5 && (o2 = 1), n[l + u + 1 + o2] = a[u];
        while (++u < a.length && u + l + 1 + o2 < n.length);
        break;
      }
      if (n[1] === 5 && l + o2 >= 2 || n[1] === 2 && l + o2 >= 5) break;
      n[1] && (o2 = 1);
    } while (++l + i < e.length && l + o2 < n.length);
    for (let a = 2; a < n.length; ++a) n[a] === -1 && (n[a] = 0);
    switch (n[0]) {
      case 38:
        r.fg = this._updateAttrColor(r.fg, n[1], n[3], n[4], n[5]);
        break;
      case 48:
        r.bg = this._updateAttrColor(r.bg, n[1], n[3], n[4], n[5]);
        break;
      case 58:
        r.extended = r.extended.clone(), r.extended.underlineColor = this._updateAttrColor(r.extended.underlineColor, n[1], n[3], n[4], n[5]);
    }
    return l;
  }
  _processUnderline(e, i) {
    i.extended = i.extended.clone(), (!~e || e > 5) && (e = 1), i.extended.underlineStyle = e, i.fg |= 268435456, e === 0 && (i.fg &= -268435457), i.updateExtended();
  }
  _processSGR0(e) {
    e.fg = X.fg, e.bg = X.bg, e.extended = e.extended.clone(), e.extended.underlineStyle = 0, e.extended.underlineColor &= -67108864, e.updateExtended();
  }
  charAttributes(e) {
    if (e.length === 1 && e.params[0] === 0) return this._processSGR0(this._curAttrData), true;
    let i = e.length, r, n = this._curAttrData;
    for (let o2 = 0; o2 < i; o2++) r = e.params[o2], r >= 30 && r <= 37 ? (n.fg &= -50331904, n.fg |= 16777216 | r - 30) : r >= 40 && r <= 47 ? (n.bg &= -50331904, n.bg |= 16777216 | r - 40) : r >= 90 && r <= 97 ? (n.fg &= -50331904, n.fg |= 16777216 | r - 90 | 8) : r >= 100 && r <= 107 ? (n.bg &= -50331904, n.bg |= 16777216 | r - 100 | 8) : r === 0 ? this._processSGR0(n) : r === 1 ? n.fg |= 134217728 : r === 3 ? n.bg |= 67108864 : r === 4 ? (n.fg |= 268435456, this._processUnderline(e.hasSubParams(o2) ? e.getSubParams(o2)[0] : 1, n)) : r === 5 ? n.fg |= 536870912 : r === 7 ? n.fg |= 67108864 : r === 8 ? n.fg |= 1073741824 : r === 9 ? n.fg |= 2147483648 : r === 2 ? n.bg |= 134217728 : r === 21 ? this._processUnderline(2, n) : r === 22 ? (n.fg &= -134217729, n.bg &= -134217729) : r === 23 ? n.bg &= -67108865 : r === 24 ? (n.fg &= -268435457, this._processUnderline(0, n)) : r === 25 ? n.fg &= -536870913 : r === 27 ? n.fg &= -67108865 : r === 28 ? n.fg &= -1073741825 : r === 29 ? n.fg &= 2147483647 : r === 39 ? (n.fg &= -67108864, n.fg |= X.fg & 16777215) : r === 49 ? (n.bg &= -67108864, n.bg |= X.bg & 16777215) : r === 38 || r === 48 || r === 58 ? o2 += this._extractColor(e, o2, n) : r === 53 ? n.bg |= 1073741824 : r === 55 ? n.bg &= -1073741825 : r === 59 ? (n.extended = n.extended.clone(), n.extended.underlineColor = -1, n.updateExtended()) : r === 100 ? (n.fg &= -67108864, n.fg |= X.fg & 16777215, n.bg &= -67108864, n.bg |= X.bg & 16777215) : this._logService.debug("Unknown SGR attribute: %d.", r);
    return true;
  }
  deviceStatus(e) {
    switch (e.params[0]) {
      case 5:
        this._coreService.triggerDataEvent(`${b.ESC}[0n`);
        break;
      case 6:
        let i = this._activeBuffer.y + 1, r = this._activeBuffer.x + 1;
        this._coreService.triggerDataEvent(`${b.ESC}[${i};${r}R`);
        break;
    }
    return true;
  }
  deviceStatusPrivate(e) {
    switch (e.params[0]) {
      case 6:
        let i = this._activeBuffer.y + 1, r = this._activeBuffer.x + 1;
        this._coreService.triggerDataEvent(`${b.ESC}[?${i};${r}R`);
        break;
      case 15:
        break;
      case 25:
        break;
      case 26:
        break;
      case 53:
        break;
    }
    return true;
  }
  softReset(e) {
    return this._coreService.isCursorHidden = false, this._onRequestSyncScrollBar.fire(), this._activeBuffer.scrollTop = 0, this._activeBuffer.scrollBottom = this._bufferService.rows - 1, this._curAttrData = X.clone(), this._coreService.reset(), this._charsetService.reset(), this._activeBuffer.savedX = 0, this._activeBuffer.savedY = this._activeBuffer.ybase, this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg, this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg, this._activeBuffer.savedCharset = this._charsetService.charset, this._coreService.decPrivateModes.origin = false, true;
  }
  setCursorStyle(e) {
    let i = e.length === 0 ? 1 : e.params[0];
    if (i === 0) this._coreService.decPrivateModes.cursorStyle = void 0, this._coreService.decPrivateModes.cursorBlink = void 0;
    else {
      switch (i) {
        case 1:
        case 2:
          this._coreService.decPrivateModes.cursorStyle = "block";
          break;
        case 3:
        case 4:
          this._coreService.decPrivateModes.cursorStyle = "underline";
          break;
        case 5:
        case 6:
          this._coreService.decPrivateModes.cursorStyle = "bar";
          break;
      }
      let r = i % 2 === 1;
      this._coreService.decPrivateModes.cursorBlink = r;
    }
    return true;
  }
  setScrollRegion(e) {
    let i = e.params[0] || 1, r;
    return (e.length < 2 || (r = e.params[1]) > this._bufferService.rows || r === 0) && (r = this._bufferService.rows), r > i && (this._activeBuffer.scrollTop = i - 1, this._activeBuffer.scrollBottom = r - 1, this._setCursor(0, 0)), true;
  }
  windowOptions(e) {
    if (!bl(e.params[0], this._optionsService.rawOptions.windowOptions)) return true;
    let i = e.length > 1 ? e.params[1] : 0;
    switch (e.params[0]) {
      case 14:
        i !== 2 && this._onRequestWindowsOptionsReport.fire(0);
        break;
      case 16:
        this._onRequestWindowsOptionsReport.fire(1);
        break;
      case 18:
        this._bufferService && this._coreService.triggerDataEvent(`${b.ESC}[8;${this._bufferService.rows};${this._bufferService.cols}t`);
        break;
      case 22:
        (i === 0 || i === 2) && (this._windowTitleStack.push(this._windowTitle), this._windowTitleStack.length > _l && this._windowTitleStack.shift()), (i === 0 || i === 1) && (this._iconNameStack.push(this._iconName), this._iconNameStack.length > _l && this._iconNameStack.shift());
        break;
      case 23:
        (i === 0 || i === 2) && this._windowTitleStack.length && this.setTitle(this._windowTitleStack.pop()), (i === 0 || i === 1) && this._iconNameStack.length && this.setIconName(this._iconNameStack.pop());
        break;
    }
    return true;
  }
  saveCursor(e) {
    return this._activeBuffer.savedX = this._activeBuffer.x, this._activeBuffer.savedY = this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg, this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg, this._activeBuffer.savedCharset = this._charsetService.charset, true;
  }
  restoreCursor(e) {
    return this._activeBuffer.x = this._activeBuffer.savedX || 0, this._activeBuffer.y = Math.max(this._activeBuffer.savedY - this._activeBuffer.ybase, 0), this._curAttrData.fg = this._activeBuffer.savedCurAttrData.fg, this._curAttrData.bg = this._activeBuffer.savedCurAttrData.bg, this._charsetService.charset = this._savedCharset, this._activeBuffer.savedCharset && (this._charsetService.charset = this._activeBuffer.savedCharset), this._restrictCursor(), true;
  }
  setTitle(e) {
    return this._windowTitle = e, this._onTitleChange.fire(e), true;
  }
  setIconName(e) {
    return this._iconName = e, true;
  }
  setOrReportIndexedColor(e) {
    let i = [], r = e.split(";");
    for (; r.length > 1; ) {
      let n = r.shift(), o2 = r.shift();
      if (/^\d+$/.exec(n)) {
        let l = parseInt(n);
        if (Sl(l)) if (o2 === "?") i.push({ type: 0, index: l });
        else {
          let a = Ws(o2);
          a && i.push({ type: 1, index: l, color: a });
        }
      }
    }
    return i.length && this._onColor.fire(i), true;
  }
  setHyperlink(e) {
    let i = e.indexOf(";");
    if (i === -1) return true;
    let r = e.slice(0, i).trim(), n = e.slice(i + 1);
    return n ? this._createHyperlink(r, n) : r.trim() ? false : this._finishHyperlink();
  }
  _createHyperlink(e, i) {
    this._getCurrentLinkId() && this._finishHyperlink();
    let r = e.split(":"), n, o2 = r.findIndex((l) => l.startsWith("id="));
    return o2 !== -1 && (n = r[o2].slice(3) || void 0), this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = this._oscLinkService.registerLink({ id: n, uri: i }), this._curAttrData.updateExtended(), true;
  }
  _finishHyperlink() {
    return this._curAttrData.extended = this._curAttrData.extended.clone(), this._curAttrData.extended.urlId = 0, this._curAttrData.updateExtended(), true;
  }
  _setOrReportSpecialColor(e, i) {
    let r = e.split(";");
    for (let n = 0; n < r.length && !(i >= this._specialColors.length); ++n, ++i) if (r[n] === "?") this._onColor.fire([{ type: 0, index: this._specialColors[i] }]);
    else {
      let o2 = Ws(r[n]);
      o2 && this._onColor.fire([{ type: 1, index: this._specialColors[i], color: o2 }]);
    }
    return true;
  }
  setOrReportFgColor(e) {
    return this._setOrReportSpecialColor(e, 0);
  }
  setOrReportBgColor(e) {
    return this._setOrReportSpecialColor(e, 1);
  }
  setOrReportCursorColor(e) {
    return this._setOrReportSpecialColor(e, 2);
  }
  restoreIndexedColor(e) {
    if (!e) return this._onColor.fire([{ type: 2 }]), true;
    let i = [], r = e.split(";");
    for (let n = 0; n < r.length; ++n) if (/^\d+$/.exec(r[n])) {
      let o2 = parseInt(r[n]);
      Sl(o2) && i.push({ type: 2, index: o2 });
    }
    return i.length && this._onColor.fire(i), true;
  }
  restoreFgColor(e) {
    return this._onColor.fire([{ type: 2, index: 256 }]), true;
  }
  restoreBgColor(e) {
    return this._onColor.fire([{ type: 2, index: 257 }]), true;
  }
  restoreCursorColor(e) {
    return this._onColor.fire([{ type: 2, index: 258 }]), true;
  }
  nextLine() {
    return this._activeBuffer.x = 0, this.index(), true;
  }
  keypadApplicationMode() {
    return this._logService.debug("Serial port requested application keypad."), this._coreService.decPrivateModes.applicationKeypad = true, this._onRequestSyncScrollBar.fire(), true;
  }
  keypadNumericMode() {
    return this._logService.debug("Switching back to normal keypad."), this._coreService.decPrivateModes.applicationKeypad = false, this._onRequestSyncScrollBar.fire(), true;
  }
  selectDefaultCharset() {
    return this._charsetService.setgLevel(0), this._charsetService.setgCharset(0, Je), true;
  }
  selectCharset(e) {
    return e.length !== 2 ? (this.selectDefaultCharset(), true) : (e[0] === "/" || this._charsetService.setgCharset(mc[e[0]], ne[e[1]] || Je), true);
  }
  index() {
    return this._restrictCursor(), this._activeBuffer.y++, this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--, this._bufferService.scroll(this._eraseAttrData())) : this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1), this._restrictCursor(), true;
  }
  tabSet() {
    return this._activeBuffer.tabs[this._activeBuffer.x] = true, true;
  }
  reverseIndex() {
    if (this._restrictCursor(), this._activeBuffer.y === this._activeBuffer.scrollTop) {
      let e = this._activeBuffer.scrollBottom - this._activeBuffer.scrollTop;
      this._activeBuffer.lines.shiftElements(this._activeBuffer.ybase + this._activeBuffer.y, e, 1), this._activeBuffer.lines.set(this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.getBlankLine(this._eraseAttrData())), this._dirtyRowTracker.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom);
    } else this._activeBuffer.y--, this._restrictCursor();
    return true;
  }
  fullReset() {
    return this._parser.reset(), this._onRequestReset.fire(), true;
  }
  reset() {
    this._curAttrData = X.clone(), this._eraseAttrDataInternal = X.clone();
  }
  _eraseAttrData() {
    return this._eraseAttrDataInternal.bg &= -67108864, this._eraseAttrDataInternal.bg |= this._curAttrData.bg & 67108863, this._eraseAttrDataInternal;
  }
  setgLevel(e) {
    return this._charsetService.setgLevel(e), true;
  }
  screenAlignmentPattern() {
    let e = new q();
    e.content = 1 << 22 | 69, e.fg = this._curAttrData.fg, e.bg = this._curAttrData.bg, this._setCursor(0, 0);
    for (let i = 0; i < this._bufferService.rows; ++i) {
      let r = this._activeBuffer.ybase + this._activeBuffer.y + i, n = this._activeBuffer.lines.get(r);
      n && (n.fill(e), n.isWrapped = false);
    }
    return this._dirtyRowTracker.markAllDirty(), this._setCursor(0, 0), true;
  }
  requestStatusString(e, i) {
    let r = (a) => (this._coreService.triggerDataEvent(`${b.ESC}${a}${b.ESC}\\`), true), n = this._bufferService.buffer, o2 = this._optionsService.rawOptions, l = { block: 2, underline: 4, bar: 6 };
    return r(e === '"q' ? `P1$r${this._curAttrData.isProtected() ? 1 : 0}"q` : e === '"p' ? 'P1$r61;1"p' : e === "r" ? `P1$r${n.scrollTop + 1};${n.scrollBottom + 1}r` : e === "m" ? "P1$r0m" : e === " q" ? `P1$r${l[o2.cursorStyle] - (o2.cursorBlink ? 1 : 0)} q` : "P0$r");
  }
  markRangeDirty(e, i) {
    this._dirtyRowTracker.markRangeDirty(e, i);
  }
};
var Zi = class {
  constructor(t2) {
    this._bufferService = t2;
    this.clearRange();
  }
  clearRange() {
    this.start = this._bufferService.buffer.y, this.end = this._bufferService.buffer.y;
  }
  markDirty(t2) {
    t2 < this.start ? this.start = t2 : t2 > this.end && (this.end = t2);
  }
  markRangeDirty(t2, e) {
    t2 > e && (gl = t2, t2 = e, e = gl), t2 < this.start && (this.start = t2), e > this.end && (this.end = e);
  }
  markAllDirty() {
    this.markRangeDirty(0, this._bufferService.rows - 1);
  }
};
Zi = M([S(0, F)], Zi);
function Sl(s15) {
  return 0 <= s15 && s15 < 256;
}
var _c = 5e7;
var El = 12;
var bc = 50;
var gn = class extends D {
  constructor(e) {
    super();
    this._action = e;
    this._writeBuffer = [];
    this._callbacks = [];
    this._pendingData = 0;
    this._bufferOffset = 0;
    this._isSyncWriting = false;
    this._syncCalls = 0;
    this._didUserInput = false;
    this._onWriteParsed = this._register(new v());
    this.onWriteParsed = this._onWriteParsed.event;
  }
  handleUserInput() {
    this._didUserInput = true;
  }
  writeSync(e, i) {
    if (i !== void 0 && this._syncCalls > i) {
      this._syncCalls = 0;
      return;
    }
    if (this._pendingData += e.length, this._writeBuffer.push(e), this._callbacks.push(void 0), this._syncCalls++, this._isSyncWriting) return;
    this._isSyncWriting = true;
    let r;
    for (; r = this._writeBuffer.shift(); ) {
      this._action(r);
      let n = this._callbacks.shift();
      n && n();
    }
    this._pendingData = 0, this._bufferOffset = 2147483647, this._isSyncWriting = false, this._syncCalls = 0;
  }
  write(e, i) {
    if (this._pendingData > _c) throw new Error("write data discarded, use flow control to avoid losing data");
    if (!this._writeBuffer.length) {
      if (this._bufferOffset = 0, this._didUserInput) {
        this._didUserInput = false, this._pendingData += e.length, this._writeBuffer.push(e), this._callbacks.push(i), this._innerWrite();
        return;
      }
      setTimeout(() => this._innerWrite());
    }
    this._pendingData += e.length, this._writeBuffer.push(e), this._callbacks.push(i);
  }
  _innerWrite(e = 0, i = true) {
    let r = e || performance.now();
    for (; this._writeBuffer.length > this._bufferOffset; ) {
      let n = this._writeBuffer[this._bufferOffset], o2 = this._action(n, i);
      if (o2) {
        let a = (u) => performance.now() - r >= El ? setTimeout(() => this._innerWrite(0, u)) : this._innerWrite(r, u);
        o2.catch((u) => (queueMicrotask(() => {
          throw u;
        }), Promise.resolve(false))).then(a);
        return;
      }
      let l = this._callbacks[this._bufferOffset];
      if (l && l(), this._bufferOffset++, this._pendingData -= n.length, performance.now() - r >= El) break;
    }
    this._writeBuffer.length > this._bufferOffset ? (this._bufferOffset > bc && (this._writeBuffer = this._writeBuffer.slice(this._bufferOffset), this._callbacks = this._callbacks.slice(this._bufferOffset), this._bufferOffset = 0), setTimeout(() => this._innerWrite())) : (this._writeBuffer.length = 0, this._callbacks.length = 0, this._pendingData = 0, this._bufferOffset = 0), this._onWriteParsed.fire();
  }
};
var ui = class {
  constructor(t2) {
    this._bufferService = t2;
    this._nextId = 1;
    this._entriesWithId = /* @__PURE__ */ new Map();
    this._dataByLinkId = /* @__PURE__ */ new Map();
  }
  registerLink(t2) {
    let e = this._bufferService.buffer;
    if (t2.id === void 0) {
      let a = e.addMarker(e.ybase + e.y), u = { data: t2, id: this._nextId++, lines: [a] };
      return a.onDispose(() => this._removeMarkerFromLink(u, a)), this._dataByLinkId.set(u.id, u), u.id;
    }
    let i = t2, r = this._getEntryIdKey(i), n = this._entriesWithId.get(r);
    if (n) return this.addLineToLink(n.id, e.ybase + e.y), n.id;
    let o2 = e.addMarker(e.ybase + e.y), l = { id: this._nextId++, key: this._getEntryIdKey(i), data: i, lines: [o2] };
    return o2.onDispose(() => this._removeMarkerFromLink(l, o2)), this._entriesWithId.set(l.key, l), this._dataByLinkId.set(l.id, l), l.id;
  }
  addLineToLink(t2, e) {
    let i = this._dataByLinkId.get(t2);
    if (i && i.lines.every((r) => r.line !== e)) {
      let r = this._bufferService.buffer.addMarker(e);
      i.lines.push(r), r.onDispose(() => this._removeMarkerFromLink(i, r));
    }
  }
  getLinkData(t2) {
    return this._dataByLinkId.get(t2)?.data;
  }
  _getEntryIdKey(t2) {
    return `${t2.id};;${t2.uri}`;
  }
  _removeMarkerFromLink(t2, e) {
    let i = t2.lines.indexOf(e);
    i !== -1 && (t2.lines.splice(i, 1), t2.lines.length === 0 && (t2.data.id !== void 0 && this._entriesWithId.delete(t2.key), this._dataByLinkId.delete(t2.id)));
  }
};
ui = M([S(0, F)], ui);
var Tl = false;
var Sn = class extends D {
  constructor(e) {
    super();
    this._windowsWrappingHeuristics = this._register(new ye());
    this._onBinary = this._register(new v());
    this.onBinary = this._onBinary.event;
    this._onData = this._register(new v());
    this.onData = this._onData.event;
    this._onLineFeed = this._register(new v());
    this.onLineFeed = this._onLineFeed.event;
    this._onResize = this._register(new v());
    this.onResize = this._onResize.event;
    this._onWriteParsed = this._register(new v());
    this.onWriteParsed = this._onWriteParsed.event;
    this._onScroll = this._register(new v());
    this._instantiationService = new ln(), this.optionsService = this._register(new dn(e)), this._instantiationService.setService(H, this.optionsService), this._bufferService = this._register(this._instantiationService.createInstance(ni)), this._instantiationService.setService(F, this._bufferService), this._logService = this._register(this._instantiationService.createInstance(ii)), this._instantiationService.setService(nr, this._logService), this.coreService = this._register(this._instantiationService.createInstance(li)), this._instantiationService.setService(ge, this.coreService), this.coreMouseService = this._register(this._instantiationService.createInstance(ai)), this._instantiationService.setService(rr, this.coreMouseService), this.unicodeService = this._register(this._instantiationService.createInstance(Ae)), this._instantiationService.setService(Js, this.unicodeService), this._charsetService = this._instantiationService.createInstance(pn), this._instantiationService.setService(Zs, this._charsetService), this._oscLinkService = this._instantiationService.createInstance(ui), this._instantiationService.setService(sr, this._oscLinkService), this._inputHandler = this._register(new vn(this._bufferService, this._charsetService, this.coreService, this._logService, this.optionsService, this._oscLinkService, this.coreMouseService, this.unicodeService)), this._register($.forward(this._inputHandler.onLineFeed, this._onLineFeed)), this._register(this._inputHandler), this._register($.forward(this._bufferService.onResize, this._onResize)), this._register($.forward(this.coreService.onData, this._onData)), this._register($.forward(this.coreService.onBinary, this._onBinary)), this._register(this.coreService.onRequestScrollToBottom(() => this.scrollToBottom(true))), this._register(this.coreService.onUserInput(() => this._writeBuffer.handleUserInput())), this._register(this.optionsService.onMultipleOptionChange(["windowsMode", "windowsPty"], () => this._handleWindowsPtyOptionChange())), this._register(this._bufferService.onScroll(() => {
      this._onScroll.fire({ position: this._bufferService.buffer.ydisp }), this._inputHandler.markRangeDirty(this._bufferService.buffer.scrollTop, this._bufferService.buffer.scrollBottom);
    })), this._writeBuffer = this._register(new gn((i, r) => this._inputHandler.parse(i, r))), this._register($.forward(this._writeBuffer.onWriteParsed, this._onWriteParsed));
  }
  get onScroll() {
    return this._onScrollApi || (this._onScrollApi = this._register(new v()), this._onScroll.event((e) => {
      this._onScrollApi?.fire(e.position);
    })), this._onScrollApi.event;
  }
  get cols() {
    return this._bufferService.cols;
  }
  get rows() {
    return this._bufferService.rows;
  }
  get buffers() {
    return this._bufferService.buffers;
  }
  get options() {
    return this.optionsService.options;
  }
  set options(e) {
    for (let i in e) this.optionsService.options[i] = e[i];
  }
  write(e, i) {
    this._writeBuffer.write(e, i);
  }
  writeSync(e, i) {
    this._logService.logLevel <= 3 && !Tl && (this._logService.warn("writeSync is unreliable and will be removed soon."), Tl = true), this._writeBuffer.writeSync(e, i);
  }
  input(e, i = true) {
    this.coreService.triggerDataEvent(e, i);
  }
  resize(e, i) {
    isNaN(e) || isNaN(i) || (e = Math.max(e, ks), i = Math.max(i, Cs), this._bufferService.resize(e, i));
  }
  scroll(e, i = false) {
    this._bufferService.scroll(e, i);
  }
  scrollLines(e, i) {
    this._bufferService.scrollLines(e, i);
  }
  scrollPages(e) {
    this.scrollLines(e * (this.rows - 1));
  }
  scrollToTop() {
    this.scrollLines(-this._bufferService.buffer.ydisp);
  }
  scrollToBottom(e) {
    this.scrollLines(this._bufferService.buffer.ybase - this._bufferService.buffer.ydisp);
  }
  scrollToLine(e) {
    let i = e - this._bufferService.buffer.ydisp;
    i !== 0 && this.scrollLines(i);
  }
  registerEscHandler(e, i) {
    return this._inputHandler.registerEscHandler(e, i);
  }
  registerDcsHandler(e, i) {
    return this._inputHandler.registerDcsHandler(e, i);
  }
  registerCsiHandler(e, i) {
    return this._inputHandler.registerCsiHandler(e, i);
  }
  registerOscHandler(e, i) {
    return this._inputHandler.registerOscHandler(e, i);
  }
  _setup() {
    this._handleWindowsPtyOptionChange();
  }
  reset() {
    this._inputHandler.reset(), this._bufferService.reset(), this._charsetService.reset(), this.coreService.reset(), this.coreMouseService.reset();
  }
  _handleWindowsPtyOptionChange() {
    let e = false, i = this.optionsService.rawOptions.windowsPty;
    i && i.buildNumber !== void 0 && i.buildNumber !== void 0 ? e = i.backend === "conpty" && i.buildNumber < 21376 : this.optionsService.rawOptions.windowsMode && (e = true), e ? this._enableWindowsWrappingHeuristics() : this._windowsWrappingHeuristics.clear();
  }
  _enableWindowsWrappingHeuristics() {
    if (!this._windowsWrappingHeuristics.value) {
      let e = [];
      e.push(this.onLineFeed(Bs.bind(null, this._bufferService))), e.push(this.registerCsiHandler({ final: "H" }, () => (Bs(this._bufferService), false))), this._windowsWrappingHeuristics.value = C(() => {
        for (let i of e) i.dispose();
      });
    }
  }
};
var gc = { 48: ["0", ")"], 49: ["1", "!"], 50: ["2", "@"], 51: ["3", "#"], 52: ["4", "$"], 53: ["5", "%"], 54: ["6", "^"], 55: ["7", "&"], 56: ["8", "*"], 57: ["9", "("], 186: [";", ":"], 187: ["=", "+"], 188: [",", "<"], 189: ["-", "_"], 190: [".", ">"], 191: ["/", "?"], 192: ["`", "~"], 219: ["[", "{"], 220: ["\\", "|"], 221: ["]", "}"], 222: ["'", '"'] };
function Il(s15, t2, e, i) {
  let r = { type: 0, cancel: false, key: void 0 }, n = (s15.shiftKey ? 1 : 0) | (s15.altKey ? 2 : 0) | (s15.ctrlKey ? 4 : 0) | (s15.metaKey ? 8 : 0);
  switch (s15.keyCode) {
    case 0:
      s15.key === "UIKeyInputUpArrow" ? t2 ? r.key = b.ESC + "OA" : r.key = b.ESC + "[A" : s15.key === "UIKeyInputLeftArrow" ? t2 ? r.key = b.ESC + "OD" : r.key = b.ESC + "[D" : s15.key === "UIKeyInputRightArrow" ? t2 ? r.key = b.ESC + "OC" : r.key = b.ESC + "[C" : s15.key === "UIKeyInputDownArrow" && (t2 ? r.key = b.ESC + "OB" : r.key = b.ESC + "[B");
      break;
    case 8:
      r.key = s15.ctrlKey ? "\b" : b.DEL, s15.altKey && (r.key = b.ESC + r.key);
      break;
    case 9:
      if (s15.shiftKey) {
        r.key = b.ESC + "[Z";
        break;
      }
      r.key = b.HT, r.cancel = true;
      break;
    case 13:
      r.key = s15.altKey ? b.ESC + b.CR : b.CR, r.cancel = true;
      break;
    case 27:
      r.key = b.ESC, s15.altKey && (r.key = b.ESC + b.ESC), r.cancel = true;
      break;
    case 37:
      if (s15.metaKey) break;
      n ? r.key = b.ESC + "[1;" + (n + 1) + "D" : t2 ? r.key = b.ESC + "OD" : r.key = b.ESC + "[D";
      break;
    case 39:
      if (s15.metaKey) break;
      n ? r.key = b.ESC + "[1;" + (n + 1) + "C" : t2 ? r.key = b.ESC + "OC" : r.key = b.ESC + "[C";
      break;
    case 38:
      if (s15.metaKey) break;
      n ? r.key = b.ESC + "[1;" + (n + 1) + "A" : t2 ? r.key = b.ESC + "OA" : r.key = b.ESC + "[A";
      break;
    case 40:
      if (s15.metaKey) break;
      n ? r.key = b.ESC + "[1;" + (n + 1) + "B" : t2 ? r.key = b.ESC + "OB" : r.key = b.ESC + "[B";
      break;
    case 45:
      !s15.shiftKey && !s15.ctrlKey && (r.key = b.ESC + "[2~");
      break;
    case 46:
      n ? r.key = b.ESC + "[3;" + (n + 1) + "~" : r.key = b.ESC + "[3~";
      break;
    case 36:
      n ? r.key = b.ESC + "[1;" + (n + 1) + "H" : t2 ? r.key = b.ESC + "OH" : r.key = b.ESC + "[H";
      break;
    case 35:
      n ? r.key = b.ESC + "[1;" + (n + 1) + "F" : t2 ? r.key = b.ESC + "OF" : r.key = b.ESC + "[F";
      break;
    case 33:
      s15.shiftKey ? r.type = 2 : s15.ctrlKey ? r.key = b.ESC + "[5;" + (n + 1) + "~" : r.key = b.ESC + "[5~";
      break;
    case 34:
      s15.shiftKey ? r.type = 3 : s15.ctrlKey ? r.key = b.ESC + "[6;" + (n + 1) + "~" : r.key = b.ESC + "[6~";
      break;
    case 112:
      n ? r.key = b.ESC + "[1;" + (n + 1) + "P" : r.key = b.ESC + "OP";
      break;
    case 113:
      n ? r.key = b.ESC + "[1;" + (n + 1) + "Q" : r.key = b.ESC + "OQ";
      break;
    case 114:
      n ? r.key = b.ESC + "[1;" + (n + 1) + "R" : r.key = b.ESC + "OR";
      break;
    case 115:
      n ? r.key = b.ESC + "[1;" + (n + 1) + "S" : r.key = b.ESC + "OS";
      break;
    case 116:
      n ? r.key = b.ESC + "[15;" + (n + 1) + "~" : r.key = b.ESC + "[15~";
      break;
    case 117:
      n ? r.key = b.ESC + "[17;" + (n + 1) + "~" : r.key = b.ESC + "[17~";
      break;
    case 118:
      n ? r.key = b.ESC + "[18;" + (n + 1) + "~" : r.key = b.ESC + "[18~";
      break;
    case 119:
      n ? r.key = b.ESC + "[19;" + (n + 1) + "~" : r.key = b.ESC + "[19~";
      break;
    case 120:
      n ? r.key = b.ESC + "[20;" + (n + 1) + "~" : r.key = b.ESC + "[20~";
      break;
    case 121:
      n ? r.key = b.ESC + "[21;" + (n + 1) + "~" : r.key = b.ESC + "[21~";
      break;
    case 122:
      n ? r.key = b.ESC + "[23;" + (n + 1) + "~" : r.key = b.ESC + "[23~";
      break;
    case 123:
      n ? r.key = b.ESC + "[24;" + (n + 1) + "~" : r.key = b.ESC + "[24~";
      break;
    default:
      if (s15.ctrlKey && !s15.shiftKey && !s15.altKey && !s15.metaKey) s15.keyCode >= 65 && s15.keyCode <= 90 ? r.key = String.fromCharCode(s15.keyCode - 64) : s15.keyCode === 32 ? r.key = b.NUL : s15.keyCode >= 51 && s15.keyCode <= 55 ? r.key = String.fromCharCode(s15.keyCode - 51 + 27) : s15.keyCode === 56 ? r.key = b.DEL : s15.keyCode === 219 ? r.key = b.ESC : s15.keyCode === 220 ? r.key = b.FS : s15.keyCode === 221 && (r.key = b.GS);
      else if ((!e || i) && s15.altKey && !s15.metaKey) {
        let l = gc[s15.keyCode]?.[s15.shiftKey ? 1 : 0];
        if (l) r.key = b.ESC + l;
        else if (s15.keyCode >= 65 && s15.keyCode <= 90) {
          let a = s15.ctrlKey ? s15.keyCode - 64 : s15.keyCode + 32, u = String.fromCharCode(a);
          s15.shiftKey && (u = u.toUpperCase()), r.key = b.ESC + u;
        } else if (s15.keyCode === 32) r.key = b.ESC + (s15.ctrlKey ? b.NUL : " ");
        else if (s15.key === "Dead" && s15.code.startsWith("Key")) {
          let a = s15.code.slice(3, 4);
          s15.shiftKey || (a = a.toLowerCase()), r.key = b.ESC + a, r.cancel = true;
        }
      } else e && !s15.altKey && !s15.ctrlKey && !s15.shiftKey && s15.metaKey ? s15.keyCode === 65 && (r.type = 1) : s15.key && !s15.ctrlKey && !s15.altKey && !s15.metaKey && s15.keyCode >= 48 && s15.key.length === 1 ? r.key = s15.key : s15.key && s15.ctrlKey && (s15.key === "_" && (r.key = b.US), s15.key === "@" && (r.key = b.NUL));
      break;
  }
  return r;
}
var ee = 0;
var En = class {
  constructor(t2) {
    this._getKey = t2;
    this._array = [];
    this._insertedValues = [];
    this._flushInsertedTask = new Jt();
    this._isFlushingInserted = false;
    this._deletedIndices = [];
    this._flushDeletedTask = new Jt();
    this._isFlushingDeleted = false;
  }
  clear() {
    this._array.length = 0, this._insertedValues.length = 0, this._flushInsertedTask.clear(), this._isFlushingInserted = false, this._deletedIndices.length = 0, this._flushDeletedTask.clear(), this._isFlushingDeleted = false;
  }
  insert(t2) {
    this._flushCleanupDeleted(), this._insertedValues.length === 0 && this._flushInsertedTask.enqueue(() => this._flushInserted()), this._insertedValues.push(t2);
  }
  _flushInserted() {
    let t2 = this._insertedValues.sort((n, o2) => this._getKey(n) - this._getKey(o2)), e = 0, i = 0, r = new Array(this._array.length + this._insertedValues.length);
    for (let n = 0; n < r.length; n++) i >= this._array.length || this._getKey(t2[e]) <= this._getKey(this._array[i]) ? (r[n] = t2[e], e++) : r[n] = this._array[i++];
    this._array = r, this._insertedValues.length = 0;
  }
  _flushCleanupInserted() {
    !this._isFlushingInserted && this._insertedValues.length > 0 && this._flushInsertedTask.flush();
  }
  delete(t2) {
    if (this._flushCleanupInserted(), this._array.length === 0) return false;
    let e = this._getKey(t2);
    if (e === void 0 || (ee = this._search(e), ee === -1) || this._getKey(this._array[ee]) !== e) return false;
    do
      if (this._array[ee] === t2) return this._deletedIndices.length === 0 && this._flushDeletedTask.enqueue(() => this._flushDeleted()), this._deletedIndices.push(ee), true;
    while (++ee < this._array.length && this._getKey(this._array[ee]) === e);
    return false;
  }
  _flushDeleted() {
    this._isFlushingDeleted = true;
    let t2 = this._deletedIndices.sort((n, o2) => n - o2), e = 0, i = new Array(this._array.length - t2.length), r = 0;
    for (let n = 0; n < this._array.length; n++) t2[e] === n ? e++ : i[r++] = this._array[n];
    this._array = i, this._deletedIndices.length = 0, this._isFlushingDeleted = false;
  }
  _flushCleanupDeleted() {
    !this._isFlushingDeleted && this._deletedIndices.length > 0 && this._flushDeletedTask.flush();
  }
  *getKeyIterator(t2) {
    if (this._flushCleanupInserted(), this._flushCleanupDeleted(), this._array.length !== 0 && (ee = this._search(t2), !(ee < 0 || ee >= this._array.length) && this._getKey(this._array[ee]) === t2)) do
      yield this._array[ee];
    while (++ee < this._array.length && this._getKey(this._array[ee]) === t2);
  }
  forEachByKey(t2, e) {
    if (this._flushCleanupInserted(), this._flushCleanupDeleted(), this._array.length !== 0 && (ee = this._search(t2), !(ee < 0 || ee >= this._array.length) && this._getKey(this._array[ee]) === t2)) do
      e(this._array[ee]);
    while (++ee < this._array.length && this._getKey(this._array[ee]) === t2);
  }
  values() {
    return this._flushCleanupInserted(), this._flushCleanupDeleted(), [...this._array].values();
  }
  _search(t2) {
    let e = 0, i = this._array.length - 1;
    for (; i >= e; ) {
      let r = e + i >> 1, n = this._getKey(this._array[r]);
      if (n > t2) i = r - 1;
      else if (n < t2) e = r + 1;
      else {
        for (; r > 0 && this._getKey(this._array[r - 1]) === t2; ) r--;
        return r;
      }
    }
    return e;
  }
};
var Us = 0;
var yl = 0;
var Tn = class extends D {
  constructor() {
    super();
    this._decorations = new En((e) => e?.marker.line);
    this._onDecorationRegistered = this._register(new v());
    this.onDecorationRegistered = this._onDecorationRegistered.event;
    this._onDecorationRemoved = this._register(new v());
    this.onDecorationRemoved = this._onDecorationRemoved.event;
    this._register(C(() => this.reset()));
  }
  get decorations() {
    return this._decorations.values();
  }
  registerDecoration(e) {
    if (e.marker.isDisposed) return;
    let i = new Ks(e);
    if (i) {
      let r = i.marker.onDispose(() => i.dispose()), n = i.onDispose(() => {
        n.dispose(), i && (this._decorations.delete(i) && this._onDecorationRemoved.fire(i), r.dispose());
      });
      this._decorations.insert(i), this._onDecorationRegistered.fire(i);
    }
    return i;
  }
  reset() {
    for (let e of this._decorations.values()) e.dispose();
    this._decorations.clear();
  }
  *getDecorationsAtCell(e, i, r) {
    let n = 0, o2 = 0;
    for (let l of this._decorations.getKeyIterator(i)) n = l.options.x ?? 0, o2 = n + (l.options.width ?? 1), e >= n && e < o2 && (!r || (l.options.layer ?? "bottom") === r) && (yield l);
  }
  forEachDecorationAtCell(e, i, r, n) {
    this._decorations.forEachByKey(i, (o2) => {
      Us = o2.options.x ?? 0, yl = Us + (o2.options.width ?? 1), e >= Us && e < yl && (!r || (o2.options.layer ?? "bottom") === r) && n(o2);
    });
  }
};
var Ks = class extends Ee {
  constructor(e) {
    super();
    this.options = e;
    this.onRenderEmitter = this.add(new v());
    this.onRender = this.onRenderEmitter.event;
    this._onDispose = this.add(new v());
    this.onDispose = this._onDispose.event;
    this._cachedBg = null;
    this._cachedFg = null;
    this.marker = e.marker, this.options.overviewRulerOptions && !this.options.overviewRulerOptions.position && (this.options.overviewRulerOptions.position = "full");
  }
  get backgroundColorRGB() {
    return this._cachedBg === null && (this.options.backgroundColor ? this._cachedBg = z.toColor(this.options.backgroundColor) : this._cachedBg = void 0), this._cachedBg;
  }
  get foregroundColorRGB() {
    return this._cachedFg === null && (this.options.foregroundColor ? this._cachedFg = z.toColor(this.options.foregroundColor) : this._cachedFg = void 0), this._cachedFg;
  }
  dispose() {
    this._onDispose.fire(), super.dispose();
  }
};
var Sc = 1e3;
var In = class {
  constructor(t2, e = Sc) {
    this._renderCallback = t2;
    this._debounceThresholdMS = e;
    this._lastRefreshMs = 0;
    this._additionalRefreshRequested = false;
  }
  dispose() {
    this._refreshTimeoutID && clearTimeout(this._refreshTimeoutID);
  }
  refresh(t2, e, i) {
    this._rowCount = i, t2 = t2 !== void 0 ? t2 : 0, e = e !== void 0 ? e : this._rowCount - 1, this._rowStart = this._rowStart !== void 0 ? Math.min(this._rowStart, t2) : t2, this._rowEnd = this._rowEnd !== void 0 ? Math.max(this._rowEnd, e) : e;
    let r = performance.now();
    if (r - this._lastRefreshMs >= this._debounceThresholdMS) this._lastRefreshMs = r, this._innerRefresh();
    else if (!this._additionalRefreshRequested) {
      let n = r - this._lastRefreshMs, o2 = this._debounceThresholdMS - n;
      this._additionalRefreshRequested = true, this._refreshTimeoutID = window.setTimeout(() => {
        this._lastRefreshMs = performance.now(), this._innerRefresh(), this._additionalRefreshRequested = false, this._refreshTimeoutID = void 0;
      }, o2);
    }
  }
  _innerRefresh() {
    if (this._rowStart === void 0 || this._rowEnd === void 0 || this._rowCount === void 0) return;
    let t2 = Math.max(this._rowStart, 0), e = Math.min(this._rowEnd, this._rowCount - 1);
    this._rowStart = void 0, this._rowEnd = void 0, this._renderCallback(t2, e);
  }
};
var xl = 20;
var wl = false;
var Tt = class extends D {
  constructor(e, i, r, n) {
    super();
    this._terminal = e;
    this._coreBrowserService = r;
    this._renderService = n;
    this._rowColumns = /* @__PURE__ */ new WeakMap();
    this._liveRegionLineCount = 0;
    this._charsToConsume = [];
    this._charsToAnnounce = "";
    let o2 = this._coreBrowserService.mainDocument;
    this._accessibilityContainer = o2.createElement("div"), this._accessibilityContainer.classList.add("xterm-accessibility"), this._rowContainer = o2.createElement("div"), this._rowContainer.setAttribute("role", "list"), this._rowContainer.classList.add("xterm-accessibility-tree"), this._rowElements = [];
    for (let l = 0; l < this._terminal.rows; l++) this._rowElements[l] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[l]);
    if (this._topBoundaryFocusListener = (l) => this._handleBoundaryFocus(l, 0), this._bottomBoundaryFocusListener = (l) => this._handleBoundaryFocus(l, 1), this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._accessibilityContainer.appendChild(this._rowContainer), this._liveRegion = o2.createElement("div"), this._liveRegion.classList.add("live-region"), this._liveRegion.setAttribute("aria-live", "assertive"), this._accessibilityContainer.appendChild(this._liveRegion), this._liveRegionDebouncer = this._register(new In(this._renderRows.bind(this))), !this._terminal.element) throw new Error("Cannot enable accessibility before Terminal.open");
    wl ? (this._accessibilityContainer.classList.add("debug"), this._rowContainer.classList.add("debug"), this._debugRootContainer = o2.createElement("div"), this._debugRootContainer.classList.add("xterm"), this._debugRootContainer.appendChild(o2.createTextNode("------start a11y------")), this._debugRootContainer.appendChild(this._accessibilityContainer), this._debugRootContainer.appendChild(o2.createTextNode("------end a11y------")), this._terminal.element.insertAdjacentElement("afterend", this._debugRootContainer)) : this._terminal.element.insertAdjacentElement("afterbegin", this._accessibilityContainer), this._register(this._terminal.onResize((l) => this._handleResize(l.rows))), this._register(this._terminal.onRender((l) => this._refreshRows(l.start, l.end))), this._register(this._terminal.onScroll(() => this._refreshRows())), this._register(this._terminal.onA11yChar((l) => this._handleChar(l))), this._register(this._terminal.onLineFeed(() => this._handleChar(`
`))), this._register(this._terminal.onA11yTab((l) => this._handleTab(l))), this._register(this._terminal.onKey((l) => this._handleKey(l.key))), this._register(this._terminal.onBlur(() => this._clearLiveRegion())), this._register(this._renderService.onDimensionsChange(() => this._refreshRowsDimensions())), this._register(L(o2, "selectionchange", () => this._handleSelectionChange())), this._register(this._coreBrowserService.onDprChange(() => this._refreshRowsDimensions())), this._refreshRowsDimensions(), this._refreshRows(), this._register(C(() => {
      wl ? this._debugRootContainer.remove() : this._accessibilityContainer.remove(), this._rowElements.length = 0;
    }));
  }
  _handleTab(e) {
    for (let i = 0; i < e; i++) this._handleChar(" ");
  }
  _handleChar(e) {
    this._liveRegionLineCount < xl + 1 && (this._charsToConsume.length > 0 ? this._charsToConsume.shift() !== e && (this._charsToAnnounce += e) : this._charsToAnnounce += e, e === `
` && (this._liveRegionLineCount++, this._liveRegionLineCount === xl + 1 && (this._liveRegion.textContent += _i.get())));
  }
  _clearLiveRegion() {
    this._liveRegion.textContent = "", this._liveRegionLineCount = 0;
  }
  _handleKey(e) {
    this._clearLiveRegion(), /\p{Control}/u.test(e) || this._charsToConsume.push(e);
  }
  _refreshRows(e, i) {
    this._liveRegionDebouncer.refresh(e, i, this._terminal.rows);
  }
  _renderRows(e, i) {
    let r = this._terminal.buffer, n = r.lines.length.toString();
    for (let o2 = e; o2 <= i; o2++) {
      let l = r.lines.get(r.ydisp + o2), a = [], u = l?.translateToString(true, void 0, void 0, a) || "", h2 = (r.ydisp + o2 + 1).toString(), c = this._rowElements[o2];
      c && (u.length === 0 ? (c.textContent = "\xA0", this._rowColumns.set(c, [0, 1])) : (c.textContent = u, this._rowColumns.set(c, a)), c.setAttribute("aria-posinset", h2), c.setAttribute("aria-setsize", n), this._alignRowWidth(c));
    }
    this._announceCharacters();
  }
  _announceCharacters() {
    this._charsToAnnounce.length !== 0 && (this._liveRegion.textContent += this._charsToAnnounce, this._charsToAnnounce = "");
  }
  _handleBoundaryFocus(e, i) {
    let r = e.target, n = this._rowElements[i === 0 ? 1 : this._rowElements.length - 2], o2 = r.getAttribute("aria-posinset"), l = i === 0 ? "1" : `${this._terminal.buffer.lines.length}`;
    if (o2 === l || e.relatedTarget !== n) return;
    let a, u;
    if (i === 0 ? (a = r, u = this._rowElements.pop(), this._rowContainer.removeChild(u)) : (a = this._rowElements.shift(), u = r, this._rowContainer.removeChild(a)), a.removeEventListener("focus", this._topBoundaryFocusListener), u.removeEventListener("focus", this._bottomBoundaryFocusListener), i === 0) {
      let h2 = this._createAccessibilityTreeNode();
      this._rowElements.unshift(h2), this._rowContainer.insertAdjacentElement("afterbegin", h2);
    } else {
      let h2 = this._createAccessibilityTreeNode();
      this._rowElements.push(h2), this._rowContainer.appendChild(h2);
    }
    this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener), this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._terminal.scrollLines(i === 0 ? -1 : 1), this._rowElements[i === 0 ? 1 : this._rowElements.length - 2].focus(), e.preventDefault(), e.stopImmediatePropagation();
  }
  _handleSelectionChange() {
    if (this._rowElements.length === 0) return;
    let e = this._coreBrowserService.mainDocument.getSelection();
    if (!e) return;
    if (e.isCollapsed) {
      this._rowContainer.contains(e.anchorNode) && this._terminal.clearSelection();
      return;
    }
    if (!e.anchorNode || !e.focusNode) {
      console.error("anchorNode and/or focusNode are null");
      return;
    }
    let i = { node: e.anchorNode, offset: e.anchorOffset }, r = { node: e.focusNode, offset: e.focusOffset };
    if ((i.node.compareDocumentPosition(r.node) & Node.DOCUMENT_POSITION_PRECEDING || i.node === r.node && i.offset > r.offset) && ([i, r] = [r, i]), i.node.compareDocumentPosition(this._rowElements[0]) & (Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_FOLLOWING) && (i = { node: this._rowElements[0].childNodes[0], offset: 0 }), !this._rowContainer.contains(i.node)) return;
    let n = this._rowElements.slice(-1)[0];
    if (r.node.compareDocumentPosition(n) & (Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_PRECEDING) && (r = { node: n, offset: n.textContent?.length ?? 0 }), !this._rowContainer.contains(r.node)) return;
    let o2 = ({ node: u, offset: h2 }) => {
      let c = u instanceof Text ? u.parentNode : u, d = parseInt(c?.getAttribute("aria-posinset"), 10) - 1;
      if (isNaN(d)) return console.warn("row is invalid. Race condition?"), null;
      let _2 = this._rowColumns.get(c);
      if (!_2) return console.warn("columns is null. Race condition?"), null;
      let p = h2 < _2.length ? _2[h2] : _2.slice(-1)[0] + 1;
      return p >= this._terminal.cols && (++d, p = 0), { row: d, column: p };
    }, l = o2(i), a = o2(r);
    if (!(!l || !a)) {
      if (l.row > a.row || l.row === a.row && l.column >= a.column) throw new Error("invalid range");
      this._terminal.select(l.column, l.row, (a.row - l.row) * this._terminal.cols - l.column + a.column);
    }
  }
  _handleResize(e) {
    this._rowElements[this._rowElements.length - 1].removeEventListener("focus", this._bottomBoundaryFocusListener);
    for (let i = this._rowContainer.children.length; i < this._terminal.rows; i++) this._rowElements[i] = this._createAccessibilityTreeNode(), this._rowContainer.appendChild(this._rowElements[i]);
    for (; this._rowElements.length > e; ) this._rowContainer.removeChild(this._rowElements.pop());
    this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener), this._refreshRowsDimensions();
  }
  _createAccessibilityTreeNode() {
    let e = this._coreBrowserService.mainDocument.createElement("div");
    return e.setAttribute("role", "listitem"), e.tabIndex = -1, this._refreshRowDimensions(e), e;
  }
  _refreshRowsDimensions() {
    if (this._renderService.dimensions.css.cell.height) {
      Object.assign(this._accessibilityContainer.style, { width: `${this._renderService.dimensions.css.canvas.width}px`, fontSize: `${this._terminal.options.fontSize}px` }), this._rowElements.length !== this._terminal.rows && this._handleResize(this._terminal.rows);
      for (let e = 0; e < this._terminal.rows; e++) this._refreshRowDimensions(this._rowElements[e]), this._alignRowWidth(this._rowElements[e]);
    }
  }
  _refreshRowDimensions(e) {
    e.style.height = `${this._renderService.dimensions.css.cell.height}px`;
  }
  _alignRowWidth(e) {
    e.style.transform = "";
    let i = e.getBoundingClientRect().width, r = this._rowColumns.get(e)?.slice(-1)?.[0];
    if (!r) return;
    let n = r * this._renderService.dimensions.css.cell.width;
    e.style.transform = `scaleX(${n / i})`;
  }
};
Tt = M([S(1, xt), S(2, ae), S(3, ce)], Tt);
var hi = class extends D {
  constructor(e, i, r, n, o2) {
    super();
    this._element = e;
    this._mouseService = i;
    this._renderService = r;
    this._bufferService = n;
    this._linkProviderService = o2;
    this._linkCacheDisposables = [];
    this._isMouseOut = true;
    this._wasResized = false;
    this._activeLine = -1;
    this._onShowLinkUnderline = this._register(new v());
    this.onShowLinkUnderline = this._onShowLinkUnderline.event;
    this._onHideLinkUnderline = this._register(new v());
    this.onHideLinkUnderline = this._onHideLinkUnderline.event;
    this._register(C(() => {
      Ne(this._linkCacheDisposables), this._linkCacheDisposables.length = 0, this._lastMouseEvent = void 0, this._activeProviderReplies?.clear();
    })), this._register(this._bufferService.onResize(() => {
      this._clearCurrentLink(), this._wasResized = true;
    })), this._register(L(this._element, "mouseleave", () => {
      this._isMouseOut = true, this._clearCurrentLink();
    })), this._register(L(this._element, "mousemove", this._handleMouseMove.bind(this))), this._register(L(this._element, "mousedown", this._handleMouseDown.bind(this))), this._register(L(this._element, "mouseup", this._handleMouseUp.bind(this)));
  }
  get currentLink() {
    return this._currentLink;
  }
  _handleMouseMove(e) {
    this._lastMouseEvent = e;
    let i = this._positionFromMouseEvent(e, this._element, this._mouseService);
    if (!i) return;
    this._isMouseOut = false;
    let r = e.composedPath();
    for (let n = 0; n < r.length; n++) {
      let o2 = r[n];
      if (o2.classList.contains("xterm")) break;
      if (o2.classList.contains("xterm-hover")) return;
    }
    (!this._lastBufferCell || i.x !== this._lastBufferCell.x || i.y !== this._lastBufferCell.y) && (this._handleHover(i), this._lastBufferCell = i);
  }
  _handleHover(e) {
    if (this._activeLine !== e.y || this._wasResized) {
      this._clearCurrentLink(), this._askForLink(e, false), this._wasResized = false;
      return;
    }
    this._currentLink && this._linkAtPosition(this._currentLink.link, e) || (this._clearCurrentLink(), this._askForLink(e, true));
  }
  _askForLink(e, i) {
    (!this._activeProviderReplies || !i) && (this._activeProviderReplies?.forEach((n) => {
      n?.forEach((o2) => {
        o2.link.dispose && o2.link.dispose();
      });
    }), this._activeProviderReplies = /* @__PURE__ */ new Map(), this._activeLine = e.y);
    let r = false;
    for (let [n, o2] of this._linkProviderService.linkProviders.entries()) i ? this._activeProviderReplies?.get(n) && (r = this._checkLinkProviderResult(n, e, r)) : o2.provideLinks(e.y, (l) => {
      if (this._isMouseOut) return;
      let a = l?.map((u) => ({ link: u }));
      this._activeProviderReplies?.set(n, a), r = this._checkLinkProviderResult(n, e, r), this._activeProviderReplies?.size === this._linkProviderService.linkProviders.length && this._removeIntersectingLinks(e.y, this._activeProviderReplies);
    });
  }
  _removeIntersectingLinks(e, i) {
    let r = /* @__PURE__ */ new Set();
    for (let n = 0; n < i.size; n++) {
      let o2 = i.get(n);
      if (o2) for (let l = 0; l < o2.length; l++) {
        let a = o2[l], u = a.link.range.start.y < e ? 0 : a.link.range.start.x, h2 = a.link.range.end.y > e ? this._bufferService.cols : a.link.range.end.x;
        for (let c = u; c <= h2; c++) {
          if (r.has(c)) {
            o2.splice(l--, 1);
            break;
          }
          r.add(c);
        }
      }
    }
  }
  _checkLinkProviderResult(e, i, r) {
    if (!this._activeProviderReplies) return r;
    let n = this._activeProviderReplies.get(e), o2 = false;
    for (let l = 0; l < e; l++) (!this._activeProviderReplies.has(l) || this._activeProviderReplies.get(l)) && (o2 = true);
    if (!o2 && n) {
      let l = n.find((a) => this._linkAtPosition(a.link, i));
      l && (r = true, this._handleNewLink(l));
    }
    if (this._activeProviderReplies.size === this._linkProviderService.linkProviders.length && !r) for (let l = 0; l < this._activeProviderReplies.size; l++) {
      let a = this._activeProviderReplies.get(l)?.find((u) => this._linkAtPosition(u.link, i));
      if (a) {
        r = true, this._handleNewLink(a);
        break;
      }
    }
    return r;
  }
  _handleMouseDown() {
    this._mouseDownLink = this._currentLink;
  }
  _handleMouseUp(e) {
    if (!this._currentLink) return;
    let i = this._positionFromMouseEvent(e, this._element, this._mouseService);
    i && this._mouseDownLink && Ec(this._mouseDownLink.link, this._currentLink.link) && this._linkAtPosition(this._currentLink.link, i) && this._currentLink.link.activate(e, this._currentLink.link.text);
  }
  _clearCurrentLink(e, i) {
    !this._currentLink || !this._lastMouseEvent || (!e || !i || this._currentLink.link.range.start.y >= e && this._currentLink.link.range.end.y <= i) && (this._linkLeave(this._element, this._currentLink.link, this._lastMouseEvent), this._currentLink = void 0, Ne(this._linkCacheDisposables), this._linkCacheDisposables.length = 0);
  }
  _handleNewLink(e) {
    if (!this._lastMouseEvent) return;
    let i = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
    i && this._linkAtPosition(e.link, i) && (this._currentLink = e, this._currentLink.state = { decorations: { underline: e.link.decorations === void 0 ? true : e.link.decorations.underline, pointerCursor: e.link.decorations === void 0 ? true : e.link.decorations.pointerCursor }, isHovered: true }, this._linkHover(this._element, e.link, this._lastMouseEvent), e.link.decorations = {}, Object.defineProperties(e.link.decorations, { pointerCursor: { get: () => this._currentLink?.state?.decorations.pointerCursor, set: (r) => {
      this._currentLink?.state && this._currentLink.state.decorations.pointerCursor !== r && (this._currentLink.state.decorations.pointerCursor = r, this._currentLink.state.isHovered && this._element.classList.toggle("xterm-cursor-pointer", r));
    } }, underline: { get: () => this._currentLink?.state?.decorations.underline, set: (r) => {
      this._currentLink?.state && this._currentLink?.state?.decorations.underline !== r && (this._currentLink.state.decorations.underline = r, this._currentLink.state.isHovered && this._fireUnderlineEvent(e.link, r));
    } } }), this._linkCacheDisposables.push(this._renderService.onRenderedViewportChange((r) => {
      if (!this._currentLink) return;
      let n = r.start === 0 ? 0 : r.start + 1 + this._bufferService.buffer.ydisp, o2 = this._bufferService.buffer.ydisp + 1 + r.end;
      if (this._currentLink.link.range.start.y >= n && this._currentLink.link.range.end.y <= o2 && (this._clearCurrentLink(n, o2), this._lastMouseEvent)) {
        let l = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
        l && this._askForLink(l, false);
      }
    })));
  }
  _linkHover(e, i, r) {
    this._currentLink?.state && (this._currentLink.state.isHovered = true, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(i, true), this._currentLink.state.decorations.pointerCursor && e.classList.add("xterm-cursor-pointer")), i.hover && i.hover(r, i.text);
  }
  _fireUnderlineEvent(e, i) {
    let r = e.range, n = this._bufferService.buffer.ydisp, o2 = this._createLinkUnderlineEvent(r.start.x - 1, r.start.y - n - 1, r.end.x, r.end.y - n - 1, void 0);
    (i ? this._onShowLinkUnderline : this._onHideLinkUnderline).fire(o2);
  }
  _linkLeave(e, i, r) {
    this._currentLink?.state && (this._currentLink.state.isHovered = false, this._currentLink.state.decorations.underline && this._fireUnderlineEvent(i, false), this._currentLink.state.decorations.pointerCursor && e.classList.remove("xterm-cursor-pointer")), i.leave && i.leave(r, i.text);
  }
  _linkAtPosition(e, i) {
    let r = e.range.start.y * this._bufferService.cols + e.range.start.x, n = e.range.end.y * this._bufferService.cols + e.range.end.x, o2 = i.y * this._bufferService.cols + i.x;
    return r <= o2 && o2 <= n;
  }
  _positionFromMouseEvent(e, i, r) {
    let n = r.getCoords(e, i, this._bufferService.cols, this._bufferService.rows);
    if (n) return { x: n[0], y: n[1] + this._bufferService.buffer.ydisp };
  }
  _createLinkUnderlineEvent(e, i, r, n, o2) {
    return { x1: e, y1: i, x2: r, y2: n, cols: this._bufferService.cols, fg: o2 };
  }
};
hi = M([S(1, Dt), S(2, ce), S(3, F), S(4, lr)], hi);
function Ec(s15, t2) {
  return s15.text === t2.text && s15.range.start.x === t2.range.start.x && s15.range.start.y === t2.range.start.y && s15.range.end.x === t2.range.end.x && s15.range.end.y === t2.range.end.y;
}
var yn = class extends Sn {
  constructor(e = {}) {
    super(e);
    this._linkifier = this._register(new ye());
    this.browser = tn;
    this._keyDownHandled = false;
    this._keyDownSeen = false;
    this._keyPressHandled = false;
    this._unprocessedDeadKey = false;
    this._accessibilityManager = this._register(new ye());
    this._onCursorMove = this._register(new v());
    this.onCursorMove = this._onCursorMove.event;
    this._onKey = this._register(new v());
    this.onKey = this._onKey.event;
    this._onRender = this._register(new v());
    this.onRender = this._onRender.event;
    this._onSelectionChange = this._register(new v());
    this.onSelectionChange = this._onSelectionChange.event;
    this._onTitleChange = this._register(new v());
    this.onTitleChange = this._onTitleChange.event;
    this._onBell = this._register(new v());
    this.onBell = this._onBell.event;
    this._onFocus = this._register(new v());
    this._onBlur = this._register(new v());
    this._onA11yCharEmitter = this._register(new v());
    this._onA11yTabEmitter = this._register(new v());
    this._onWillOpen = this._register(new v());
    this._setup(), this._decorationService = this._instantiationService.createInstance(Tn), this._instantiationService.setService(Be, this._decorationService), this._linkProviderService = this._instantiationService.createInstance(Qr), this._instantiationService.setService(lr, this._linkProviderService), this._linkProviderService.registerLinkProvider(this._instantiationService.createInstance(wt)), this._register(this._inputHandler.onRequestBell(() => this._onBell.fire())), this._register(this._inputHandler.onRequestRefreshRows((i) => this.refresh(i?.start ?? 0, i?.end ?? this.rows - 1))), this._register(this._inputHandler.onRequestSendFocus(() => this._reportFocus())), this._register(this._inputHandler.onRequestReset(() => this.reset())), this._register(this._inputHandler.onRequestWindowsOptionsReport((i) => this._reportWindowsOptions(i))), this._register(this._inputHandler.onColor((i) => this._handleColorEvent(i))), this._register($.forward(this._inputHandler.onCursorMove, this._onCursorMove)), this._register($.forward(this._inputHandler.onTitleChange, this._onTitleChange)), this._register($.forward(this._inputHandler.onA11yChar, this._onA11yCharEmitter)), this._register($.forward(this._inputHandler.onA11yTab, this._onA11yTabEmitter)), this._register(this._bufferService.onResize((i) => this._afterResize(i.cols, i.rows))), this._register(C(() => {
      this._customKeyEventHandler = void 0, this.element?.parentNode?.removeChild(this.element);
    }));
  }
  get linkifier() {
    return this._linkifier.value;
  }
  get onFocus() {
    return this._onFocus.event;
  }
  get onBlur() {
    return this._onBlur.event;
  }
  get onA11yChar() {
    return this._onA11yCharEmitter.event;
  }
  get onA11yTab() {
    return this._onA11yTabEmitter.event;
  }
  get onWillOpen() {
    return this._onWillOpen.event;
  }
  _handleColorEvent(e) {
    if (this._themeService) for (let i of e) {
      let r, n = "";
      switch (i.index) {
        case 256:
          r = "foreground", n = "10";
          break;
        case 257:
          r = "background", n = "11";
          break;
        case 258:
          r = "cursor", n = "12";
          break;
        default:
          r = "ansi", n = "4;" + i.index;
      }
      switch (i.type) {
        case 0:
          let o2 = U.toColorRGB(r === "ansi" ? this._themeService.colors.ansi[i.index] : this._themeService.colors[r]);
          this.coreService.triggerDataEvent(`${b.ESC}]${n};${ml(o2)}${fs.ST}`);
          break;
        case 1:
          if (r === "ansi") this._themeService.modifyColors((l) => l.ansi[i.index] = j.toColor(...i.color));
          else {
            let l = r;
            this._themeService.modifyColors((a) => a[l] = j.toColor(...i.color));
          }
          break;
        case 2:
          this._themeService.restoreColor(i.index);
          break;
      }
    }
  }
  _setup() {
    super._setup(), this._customKeyEventHandler = void 0;
  }
  get buffer() {
    return this.buffers.active;
  }
  focus() {
    this.textarea && this.textarea.focus({ preventScroll: true });
  }
  _handleScreenReaderModeOptionChange(e) {
    e ? !this._accessibilityManager.value && this._renderService && (this._accessibilityManager.value = this._instantiationService.createInstance(Tt, this)) : this._accessibilityManager.clear();
  }
  _handleTextAreaFocus(e) {
    this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(b.ESC + "[I"), this.element.classList.add("focus"), this._showCursor(), this._onFocus.fire();
  }
  blur() {
    return this.textarea?.blur();
  }
  _handleTextAreaBlur() {
    this.textarea.value = "", this.refresh(this.buffer.y, this.buffer.y), this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(b.ESC + "[O"), this.element.classList.remove("focus"), this._onBlur.fire();
  }
  _syncTextArea() {
    if (!this.textarea || !this.buffer.isCursorInViewport || this._compositionHelper.isComposing || !this._renderService) return;
    let e = this.buffer.ybase + this.buffer.y, i = this.buffer.lines.get(e);
    if (!i) return;
    let r = Math.min(this.buffer.x, this.cols - 1), n = this._renderService.dimensions.css.cell.height, o2 = i.getWidth(r), l = this._renderService.dimensions.css.cell.width * o2, a = this.buffer.y * this._renderService.dimensions.css.cell.height, u = r * this._renderService.dimensions.css.cell.width;
    this.textarea.style.left = u + "px", this.textarea.style.top = a + "px", this.textarea.style.width = l + "px", this.textarea.style.height = n + "px", this.textarea.style.lineHeight = n + "px", this.textarea.style.zIndex = "-5";
  }
  _initGlobal() {
    this._bindKeys(), this._register(L(this.element, "copy", (i) => {
      this.hasSelection() && Vs(i, this._selectionService);
    }));
    let e = (i) => qs(i, this.textarea, this.coreService, this.optionsService);
    this._register(L(this.textarea, "paste", e)), this._register(L(this.element, "paste", e)), Ss ? this._register(L(this.element, "mousedown", (i) => {
      i.button === 2 && Pn(i, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
    })) : this._register(L(this.element, "contextmenu", (i) => {
      Pn(i, this.textarea, this.screenElement, this._selectionService, this.options.rightClickSelectsWord);
    })), Bi && this._register(L(this.element, "auxclick", (i) => {
      i.button === 1 && Mn(i, this.textarea, this.screenElement);
    }));
  }
  _bindKeys() {
    this._register(L(this.textarea, "keyup", (e) => this._keyUp(e), true)), this._register(L(this.textarea, "keydown", (e) => this._keyDown(e), true)), this._register(L(this.textarea, "keypress", (e) => this._keyPress(e), true)), this._register(L(this.textarea, "compositionstart", () => this._compositionHelper.compositionstart())), this._register(L(this.textarea, "compositionupdate", (e) => this._compositionHelper.compositionupdate(e))), this._register(L(this.textarea, "compositionend", () => this._compositionHelper.compositionend())), this._register(L(this.textarea, "input", (e) => this._inputEvent(e), true)), this._register(this.onRender(() => this._compositionHelper.updateCompositionElements()));
  }
  open(e) {
    if (!e) throw new Error("Terminal requires a parent element.");
    if (e.isConnected || this._logService.debug("Terminal.open was called on an element that was not attached to the DOM"), this.element?.ownerDocument.defaultView && this._coreBrowserService) {
      this.element.ownerDocument.defaultView !== this._coreBrowserService.window && (this._coreBrowserService.window = this.element.ownerDocument.defaultView);
      return;
    }
    this._document = e.ownerDocument, this.options.documentOverride && this.options.documentOverride instanceof Document && (this._document = this.optionsService.rawOptions.documentOverride), this.element = this._document.createElement("div"), this.element.dir = "ltr", this.element.classList.add("terminal"), this.element.classList.add("xterm"), e.appendChild(this.element);
    let i = this._document.createDocumentFragment();
    this._viewportElement = this._document.createElement("div"), this._viewportElement.classList.add("xterm-viewport"), i.appendChild(this._viewportElement), this.screenElement = this._document.createElement("div"), this.screenElement.classList.add("xterm-screen"), this._register(L(this.screenElement, "mousemove", (o2) => this.updateCursorStyle(o2))), this._helperContainer = this._document.createElement("div"), this._helperContainer.classList.add("xterm-helpers"), this.screenElement.appendChild(this._helperContainer), i.appendChild(this.screenElement);
    let r = this.textarea = this._document.createElement("textarea");
    this.textarea.classList.add("xterm-helper-textarea"), this.textarea.setAttribute("aria-label", mi.get()), Ts || this.textarea.setAttribute("aria-multiline", "false"), this.textarea.setAttribute("autocorrect", "off"), this.textarea.setAttribute("autocapitalize", "off"), this.textarea.setAttribute("spellcheck", "false"), this.textarea.tabIndex = 0, this._register(this.optionsService.onSpecificOptionChange("disableStdin", () => r.readOnly = this.optionsService.rawOptions.disableStdin)), this.textarea.readOnly = this.optionsService.rawOptions.disableStdin, this._coreBrowserService = this._register(this._instantiationService.createInstance(Jr, this.textarea, e.ownerDocument.defaultView ?? window, this._document ?? typeof window < "u" ? window.document : null)), this._instantiationService.setService(ae, this._coreBrowserService), this._register(L(this.textarea, "focus", (o2) => this._handleTextAreaFocus(o2))), this._register(L(this.textarea, "blur", () => this._handleTextAreaBlur())), this._helperContainer.appendChild(this.textarea), this._charSizeService = this._instantiationService.createInstance(jt, this._document, this._helperContainer), this._instantiationService.setService(nt, this._charSizeService), this._themeService = this._instantiationService.createInstance(ti), this._instantiationService.setService(Re, this._themeService), this._characterJoinerService = this._instantiationService.createInstance(ct), this._instantiationService.setService(or, this._characterJoinerService), this._renderService = this._register(this._instantiationService.createInstance(Qt, this.rows, this.screenElement)), this._instantiationService.setService(ce, this._renderService), this._register(this._renderService.onRenderedViewportChange((o2) => this._onRender.fire(o2))), this.onResize((o2) => this._renderService.resize(o2.cols, o2.rows)), this._compositionView = this._document.createElement("div"), this._compositionView.classList.add("composition-view"), this._compositionHelper = this._instantiationService.createInstance($t, this.textarea, this._compositionView), this._helperContainer.appendChild(this._compositionView), this._mouseService = this._instantiationService.createInstance(Xt), this._instantiationService.setService(Dt, this._mouseService);
    let n = this._linkifier.value = this._register(this._instantiationService.createInstance(hi, this.screenElement));
    this.element.appendChild(i);
    try {
      this._onWillOpen.fire(this.element);
    } catch {
    }
    this._renderService.hasRenderer() || this._renderService.setRenderer(this._createRenderer()), this._register(this.onCursorMove(() => {
      this._renderService.handleCursorMove(), this._syncTextArea();
    })), this._register(this.onResize(() => this._renderService.handleResize(this.cols, this.rows))), this._register(this.onBlur(() => this._renderService.handleBlur())), this._register(this.onFocus(() => this._renderService.handleFocus())), this._viewport = this._register(this._instantiationService.createInstance(zt, this.element, this.screenElement)), this._register(this._viewport.onRequestScrollLines((o2) => {
      super.scrollLines(o2, false), this.refresh(0, this.rows - 1);
    })), this._selectionService = this._register(this._instantiationService.createInstance(ei, this.element, this.screenElement, n)), this._instantiationService.setService(Qs, this._selectionService), this._register(this._selectionService.onRequestScrollLines((o2) => this.scrollLines(o2.amount, o2.suppressScrollEvent))), this._register(this._selectionService.onSelectionChange(() => this._onSelectionChange.fire())), this._register(this._selectionService.onRequestRedraw((o2) => this._renderService.handleSelectionChanged(o2.start, o2.end, o2.columnSelectMode))), this._register(this._selectionService.onLinuxMouseSelection((o2) => {
      this.textarea.value = o2, this.textarea.focus(), this.textarea.select();
    })), this._register($.any(this._onScroll.event, this._inputHandler.onScroll)(() => {
      this._selectionService.refresh(), this._viewport?.queueSync();
    })), this._register(this._instantiationService.createInstance(Gt, this.screenElement)), this._register(L(this.element, "mousedown", (o2) => this._selectionService.handleMouseDown(o2))), this.coreMouseService.areMouseEventsActive ? (this._selectionService.disable(), this.element.classList.add("enable-mouse-events")) : this._selectionService.enable(), this.options.screenReaderMode && (this._accessibilityManager.value = this._instantiationService.createInstance(Tt, this)), this._register(this.optionsService.onSpecificOptionChange("screenReaderMode", (o2) => this._handleScreenReaderModeOptionChange(o2))), this.options.overviewRuler.width && (this._overviewRulerRenderer = this._register(this._instantiationService.createInstance(bt, this._viewportElement, this.screenElement))), this.optionsService.onSpecificOptionChange("overviewRuler", (o2) => {
      !this._overviewRulerRenderer && o2 && this._viewportElement && this.screenElement && (this._overviewRulerRenderer = this._register(this._instantiationService.createInstance(bt, this._viewportElement, this.screenElement)));
    }), this._charSizeService.measure(), this.refresh(0, this.rows - 1), this._initGlobal(), this.bindMouse();
  }
  _createRenderer() {
    return this._instantiationService.createInstance(Yt, this, this._document, this.element, this.screenElement, this._viewportElement, this._helperContainer, this.linkifier);
  }
  bindMouse() {
    let e = this, i = this.element;
    function r(l) {
      let a = e._mouseService.getMouseReportCoords(l, e.screenElement);
      if (!a) return false;
      let u, h2;
      switch (l.overrideType || l.type) {
        case "mousemove":
          h2 = 32, l.buttons === void 0 ? (u = 3, l.button !== void 0 && (u = l.button < 3 ? l.button : 3)) : u = l.buttons & 1 ? 0 : l.buttons & 4 ? 1 : l.buttons & 2 ? 2 : 3;
          break;
        case "mouseup":
          h2 = 0, u = l.button < 3 ? l.button : 3;
          break;
        case "mousedown":
          h2 = 1, u = l.button < 3 ? l.button : 3;
          break;
        case "wheel":
          if (e._customWheelEventHandler && e._customWheelEventHandler(l) === false) return false;
          let c = l.deltaY;
          if (c === 0 || e.coreMouseService.consumeWheelEvent(l, e._renderService?.dimensions?.device?.cell?.height, e._coreBrowserService?.dpr) === 0) return false;
          h2 = c < 0 ? 0 : 1, u = 4;
          break;
        default:
          return false;
      }
      return h2 === void 0 || u === void 0 || u > 4 ? false : e.coreMouseService.triggerMouseEvent({ col: a.col, row: a.row, x: a.x, y: a.y, button: u, action: h2, ctrl: l.ctrlKey, alt: l.altKey, shift: l.shiftKey });
    }
    let n = { mouseup: null, wheel: null, mousedrag: null, mousemove: null }, o2 = { mouseup: (l) => (r(l), l.buttons || (this._document.removeEventListener("mouseup", n.mouseup), n.mousedrag && this._document.removeEventListener("mousemove", n.mousedrag)), this.cancel(l)), wheel: (l) => (r(l), this.cancel(l, true)), mousedrag: (l) => {
      l.buttons && r(l);
    }, mousemove: (l) => {
      l.buttons || r(l);
    } };
    this._register(this.coreMouseService.onProtocolChange((l) => {
      l ? (this.optionsService.rawOptions.logLevel === "debug" && this._logService.debug("Binding to mouse events:", this.coreMouseService.explainEvents(l)), this.element.classList.add("enable-mouse-events"), this._selectionService.disable()) : (this._logService.debug("Unbinding from mouse events."), this.element.classList.remove("enable-mouse-events"), this._selectionService.enable()), l & 8 ? n.mousemove || (i.addEventListener("mousemove", o2.mousemove), n.mousemove = o2.mousemove) : (i.removeEventListener("mousemove", n.mousemove), n.mousemove = null), l & 16 ? n.wheel || (i.addEventListener("wheel", o2.wheel, { passive: false }), n.wheel = o2.wheel) : (i.removeEventListener("wheel", n.wheel), n.wheel = null), l & 2 ? n.mouseup || (n.mouseup = o2.mouseup) : (this._document.removeEventListener("mouseup", n.mouseup), n.mouseup = null), l & 4 ? n.mousedrag || (n.mousedrag = o2.mousedrag) : (this._document.removeEventListener("mousemove", n.mousedrag), n.mousedrag = null);
    })), this.coreMouseService.activeProtocol = this.coreMouseService.activeProtocol, this._register(L(i, "mousedown", (l) => {
      if (l.preventDefault(), this.focus(), !(!this.coreMouseService.areMouseEventsActive || this._selectionService.shouldForceSelection(l))) return r(l), n.mouseup && this._document.addEventListener("mouseup", n.mouseup), n.mousedrag && this._document.addEventListener("mousemove", n.mousedrag), this.cancel(l);
    })), this._register(L(i, "wheel", (l) => {
      if (!n.wheel) {
        if (this._customWheelEventHandler && this._customWheelEventHandler(l) === false) return false;
        if (!this.buffer.hasScrollback) {
          if (l.deltaY === 0) return false;
          if (e.coreMouseService.consumeWheelEvent(l, e._renderService?.dimensions?.device?.cell?.height, e._coreBrowserService?.dpr) === 0) return this.cancel(l, true);
          let h2 = b.ESC + (this.coreService.decPrivateModes.applicationCursorKeys ? "O" : "[") + (l.deltaY < 0 ? "A" : "B");
          return this.coreService.triggerDataEvent(h2, true), this.cancel(l, true);
        }
      }
    }, { passive: false }));
  }
  refresh(e, i) {
    this._renderService?.refreshRows(e, i);
  }
  updateCursorStyle(e) {
    this._selectionService?.shouldColumnSelect(e) ? this.element.classList.add("column-select") : this.element.classList.remove("column-select");
  }
  _showCursor() {
    this.coreService.isCursorInitialized || (this.coreService.isCursorInitialized = true, this.refresh(this.buffer.y, this.buffer.y));
  }
  scrollLines(e, i) {
    this._viewport ? this._viewport.scrollLines(e) : super.scrollLines(e, i), this.refresh(0, this.rows - 1);
  }
  scrollPages(e) {
    this.scrollLines(e * (this.rows - 1));
  }
  scrollToTop() {
    this.scrollLines(-this._bufferService.buffer.ydisp);
  }
  scrollToBottom(e) {
    e && this._viewport ? this._viewport.scrollToLine(this.buffer.ybase, true) : this.scrollLines(this._bufferService.buffer.ybase - this._bufferService.buffer.ydisp);
  }
  scrollToLine(e) {
    let i = e - this._bufferService.buffer.ydisp;
    i !== 0 && this.scrollLines(i);
  }
  paste(e) {
    Cn(e, this.textarea, this.coreService, this.optionsService);
  }
  attachCustomKeyEventHandler(e) {
    this._customKeyEventHandler = e;
  }
  attachCustomWheelEventHandler(e) {
    this._customWheelEventHandler = e;
  }
  registerLinkProvider(e) {
    return this._linkProviderService.registerLinkProvider(e);
  }
  registerCharacterJoiner(e) {
    if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
    let i = this._characterJoinerService.register(e);
    return this.refresh(0, this.rows - 1), i;
  }
  deregisterCharacterJoiner(e) {
    if (!this._characterJoinerService) throw new Error("Terminal must be opened first");
    this._characterJoinerService.deregister(e) && this.refresh(0, this.rows - 1);
  }
  get markers() {
    return this.buffer.markers;
  }
  registerMarker(e) {
    return this.buffer.addMarker(this.buffer.ybase + this.buffer.y + e);
  }
  registerDecoration(e) {
    return this._decorationService.registerDecoration(e);
  }
  hasSelection() {
    return this._selectionService ? this._selectionService.hasSelection : false;
  }
  select(e, i, r) {
    this._selectionService.setSelection(e, i, r);
  }
  getSelection() {
    return this._selectionService ? this._selectionService.selectionText : "";
  }
  getSelectionPosition() {
    if (!(!this._selectionService || !this._selectionService.hasSelection)) return { start: { x: this._selectionService.selectionStart[0], y: this._selectionService.selectionStart[1] }, end: { x: this._selectionService.selectionEnd[0], y: this._selectionService.selectionEnd[1] } };
  }
  clearSelection() {
    this._selectionService?.clearSelection();
  }
  selectAll() {
    this._selectionService?.selectAll();
  }
  selectLines(e, i) {
    this._selectionService?.selectLines(e, i);
  }
  _keyDown(e) {
    if (this._keyDownHandled = false, this._keyDownSeen = true, this._customKeyEventHandler && this._customKeyEventHandler(e) === false) return false;
    let i = this.browser.isMac && this.options.macOptionIsMeta && e.altKey;
    if (!i && !this._compositionHelper.keydown(e)) return this.options.scrollOnUserInput && this.buffer.ybase !== this.buffer.ydisp && this.scrollToBottom(true), false;
    !i && (e.key === "Dead" || e.key === "AltGraph") && (this._unprocessedDeadKey = true);
    let r = Il(e, this.coreService.decPrivateModes.applicationCursorKeys, this.browser.isMac, this.options.macOptionIsMeta);
    if (this.updateCursorStyle(e), r.type === 3 || r.type === 2) {
      let n = this.rows - 1;
      return this.scrollLines(r.type === 2 ? -n : n), this.cancel(e, true);
    }
    if (r.type === 1 && this.selectAll(), this._isThirdLevelShift(this.browser, e) || (r.cancel && this.cancel(e, true), !r.key) || e.key && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1 && e.key.charCodeAt(0) >= 65 && e.key.charCodeAt(0) <= 90) return true;
    if (this._unprocessedDeadKey) return this._unprocessedDeadKey = false, true;
    if ((r.key === b.ETX || r.key === b.CR) && (this.textarea.value = ""), this._onKey.fire({ key: r.key, domEvent: e }), this._showCursor(), this.coreService.triggerDataEvent(r.key, true), !this.optionsService.rawOptions.screenReaderMode || e.altKey || e.ctrlKey) return this.cancel(e, true);
    this._keyDownHandled = true;
  }
  _isThirdLevelShift(e, i) {
    let r = e.isMac && !this.options.macOptionIsMeta && i.altKey && !i.ctrlKey && !i.metaKey || e.isWindows && i.altKey && i.ctrlKey && !i.metaKey || e.isWindows && i.getModifierState("AltGraph");
    return i.type === "keypress" ? r : r && (!i.keyCode || i.keyCode > 47);
  }
  _keyUp(e) {
    this._keyDownSeen = false, !(this._customKeyEventHandler && this._customKeyEventHandler(e) === false) && (Tc(e) || this.focus(), this.updateCursorStyle(e), this._keyPressHandled = false);
  }
  _keyPress(e) {
    let i;
    if (this._keyPressHandled = false, this._keyDownHandled || this._customKeyEventHandler && this._customKeyEventHandler(e) === false) return false;
    if (this.cancel(e), e.charCode) i = e.charCode;
    else if (e.which === null || e.which === void 0) i = e.keyCode;
    else if (e.which !== 0 && e.charCode !== 0) i = e.which;
    else return false;
    return !i || (e.altKey || e.ctrlKey || e.metaKey) && !this._isThirdLevelShift(this.browser, e) ? false : (i = String.fromCharCode(i), this._onKey.fire({ key: i, domEvent: e }), this._showCursor(), this.coreService.triggerDataEvent(i, true), this._keyPressHandled = true, this._unprocessedDeadKey = false, true);
  }
  _inputEvent(e) {
    if (e.data && e.inputType === "insertText" && (!e.composed || !this._keyDownSeen) && !this.optionsService.rawOptions.screenReaderMode) {
      if (this._keyPressHandled) return false;
      this._unprocessedDeadKey = false;
      let i = e.data;
      return this.coreService.triggerDataEvent(i, true), this.cancel(e), true;
    }
    return false;
  }
  resize(e, i) {
    if (e === this.cols && i === this.rows) {
      this._charSizeService && !this._charSizeService.hasValidSize && this._charSizeService.measure();
      return;
    }
    super.resize(e, i);
  }
  _afterResize(e, i) {
    this._charSizeService?.measure();
  }
  clear() {
    if (!(this.buffer.ybase === 0 && this.buffer.y === 0)) {
      this.buffer.clearAllMarkers(), this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y)), this.buffer.lines.length = 1, this.buffer.ydisp = 0, this.buffer.ybase = 0, this.buffer.y = 0;
      for (let e = 1; e < this.rows; e++) this.buffer.lines.push(this.buffer.getBlankLine(X));
      this._onScroll.fire({ position: this.buffer.ydisp }), this.refresh(0, this.rows - 1);
    }
  }
  reset() {
    this.options.rows = this.rows, this.options.cols = this.cols;
    let e = this._customKeyEventHandler;
    this._setup(), super.reset(), this._selectionService?.reset(), this._decorationService.reset(), this._customKeyEventHandler = e, this.refresh(0, this.rows - 1);
  }
  clearTextureAtlas() {
    this._renderService?.clearTextureAtlas();
  }
  _reportFocus() {
    this.element?.classList.contains("focus") ? this.coreService.triggerDataEvent(b.ESC + "[I") : this.coreService.triggerDataEvent(b.ESC + "[O");
  }
  _reportWindowsOptions(e) {
    if (this._renderService) switch (e) {
      case 0:
        let i = this._renderService.dimensions.css.canvas.width.toFixed(0), r = this._renderService.dimensions.css.canvas.height.toFixed(0);
        this.coreService.triggerDataEvent(`${b.ESC}[4;${r};${i}t`);
        break;
      case 1:
        let n = this._renderService.dimensions.css.cell.width.toFixed(0), o2 = this._renderService.dimensions.css.cell.height.toFixed(0);
        this.coreService.triggerDataEvent(`${b.ESC}[6;${o2};${n}t`);
        break;
    }
  }
  cancel(e, i) {
    if (!(!this.options.cancelEvents && !i)) return e.preventDefault(), e.stopPropagation(), false;
  }
};
function Tc(s15) {
  return s15.keyCode === 16 || s15.keyCode === 17 || s15.keyCode === 18;
}
var xn = class {
  constructor() {
    this._addons = [];
  }
  dispose() {
    for (let t2 = this._addons.length - 1; t2 >= 0; t2--) this._addons[t2].instance.dispose();
  }
  loadAddon(t2, e) {
    let i = { instance: e, dispose: e.dispose, isDisposed: false };
    this._addons.push(i), e.dispose = () => this._wrappedAddonDispose(i), e.activate(t2);
  }
  _wrappedAddonDispose(t2) {
    if (t2.isDisposed) return;
    let e = -1;
    for (let i = 0; i < this._addons.length; i++) if (this._addons[i] === t2) {
      e = i;
      break;
    }
    if (e === -1) throw new Error("Could not dispose an addon that has not been loaded");
    t2.isDisposed = true, t2.dispose.apply(t2.instance), this._addons.splice(e, 1);
  }
};
var wn = class {
  constructor(t2) {
    this._line = t2;
  }
  get isWrapped() {
    return this._line.isWrapped;
  }
  get length() {
    return this._line.length;
  }
  getCell(t2, e) {
    if (!(t2 < 0 || t2 >= this._line.length)) return e ? (this._line.loadCell(t2, e), e) : this._line.loadCell(t2, new q());
  }
  translateToString(t2, e, i) {
    return this._line.translateToString(t2, e, i);
  }
};
var Ji = class {
  constructor(t2, e) {
    this._buffer = t2;
    this.type = e;
  }
  init(t2) {
    return this._buffer = t2, this;
  }
  get cursorY() {
    return this._buffer.y;
  }
  get cursorX() {
    return this._buffer.x;
  }
  get viewportY() {
    return this._buffer.ydisp;
  }
  get baseY() {
    return this._buffer.ybase;
  }
  get length() {
    return this._buffer.lines.length;
  }
  getLine(t2) {
    let e = this._buffer.lines.get(t2);
    if (e) return new wn(e);
  }
  getNullCell() {
    return new q();
  }
};
var Dn = class extends D {
  constructor(e) {
    super();
    this._core = e;
    this._onBufferChange = this._register(new v());
    this.onBufferChange = this._onBufferChange.event;
    this._normal = new Ji(this._core.buffers.normal, "normal"), this._alternate = new Ji(this._core.buffers.alt, "alternate"), this._core.buffers.onBufferActivate(() => this._onBufferChange.fire(this.active));
  }
  get active() {
    if (this._core.buffers.active === this._core.buffers.normal) return this.normal;
    if (this._core.buffers.active === this._core.buffers.alt) return this.alternate;
    throw new Error("Active buffer is neither normal nor alternate");
  }
  get normal() {
    return this._normal.init(this._core.buffers.normal);
  }
  get alternate() {
    return this._alternate.init(this._core.buffers.alt);
  }
};
var Rn = class {
  constructor(t2) {
    this._core = t2;
  }
  registerCsiHandler(t2, e) {
    return this._core.registerCsiHandler(t2, (i) => e(i.toArray()));
  }
  addCsiHandler(t2, e) {
    return this.registerCsiHandler(t2, e);
  }
  registerDcsHandler(t2, e) {
    return this._core.registerDcsHandler(t2, (i, r) => e(i, r.toArray()));
  }
  addDcsHandler(t2, e) {
    return this.registerDcsHandler(t2, e);
  }
  registerEscHandler(t2, e) {
    return this._core.registerEscHandler(t2, e);
  }
  addEscHandler(t2, e) {
    return this.registerEscHandler(t2, e);
  }
  registerOscHandler(t2, e) {
    return this._core.registerOscHandler(t2, e);
  }
  addOscHandler(t2, e) {
    return this.registerOscHandler(t2, e);
  }
};
var Ln = class {
  constructor(t2) {
    this._core = t2;
  }
  register(t2) {
    this._core.unicodeService.register(t2);
  }
  get versions() {
    return this._core.unicodeService.versions;
  }
  get activeVersion() {
    return this._core.unicodeService.activeVersion;
  }
  set activeVersion(t2) {
    this._core.unicodeService.activeVersion = t2;
  }
};
var Ic = ["cols", "rows"];
var Ue = 0;
var Dl = class extends D {
  constructor(t2) {
    super(), this._core = this._register(new yn(t2)), this._addonManager = this._register(new xn()), this._publicOptions = { ...this._core.options };
    let e = (r) => this._core.options[r], i = (r, n) => {
      this._checkReadonlyOptions(r), this._core.options[r] = n;
    };
    for (let r in this._core.options) {
      let n = { get: e.bind(this, r), set: i.bind(this, r) };
      Object.defineProperty(this._publicOptions, r, n);
    }
  }
  _checkReadonlyOptions(t2) {
    if (Ic.includes(t2)) throw new Error(`Option "${t2}" can only be set in the constructor`);
  }
  _checkProposedApi() {
    if (!this._core.optionsService.rawOptions.allowProposedApi) throw new Error("You must set the allowProposedApi option to true to use proposed API");
  }
  get onBell() {
    return this._core.onBell;
  }
  get onBinary() {
    return this._core.onBinary;
  }
  get onCursorMove() {
    return this._core.onCursorMove;
  }
  get onData() {
    return this._core.onData;
  }
  get onKey() {
    return this._core.onKey;
  }
  get onLineFeed() {
    return this._core.onLineFeed;
  }
  get onRender() {
    return this._core.onRender;
  }
  get onResize() {
    return this._core.onResize;
  }
  get onScroll() {
    return this._core.onScroll;
  }
  get onSelectionChange() {
    return this._core.onSelectionChange;
  }
  get onTitleChange() {
    return this._core.onTitleChange;
  }
  get onWriteParsed() {
    return this._core.onWriteParsed;
  }
  get element() {
    return this._core.element;
  }
  get parser() {
    return this._parser || (this._parser = new Rn(this._core)), this._parser;
  }
  get unicode() {
    return this._checkProposedApi(), new Ln(this._core);
  }
  get textarea() {
    return this._core.textarea;
  }
  get rows() {
    return this._core.rows;
  }
  get cols() {
    return this._core.cols;
  }
  get buffer() {
    return this._buffer || (this._buffer = this._register(new Dn(this._core))), this._buffer;
  }
  get markers() {
    return this._checkProposedApi(), this._core.markers;
  }
  get modes() {
    let t2 = this._core.coreService.decPrivateModes, e = "none";
    switch (this._core.coreMouseService.activeProtocol) {
      case "X10":
        e = "x10";
        break;
      case "VT200":
        e = "vt200";
        break;
      case "DRAG":
        e = "drag";
        break;
      case "ANY":
        e = "any";
        break;
    }
    return { applicationCursorKeysMode: t2.applicationCursorKeys, applicationKeypadMode: t2.applicationKeypad, bracketedPasteMode: t2.bracketedPasteMode, insertMode: this._core.coreService.modes.insertMode, mouseTrackingMode: e, originMode: t2.origin, reverseWraparoundMode: t2.reverseWraparound, sendFocusMode: t2.sendFocus, synchronizedOutputMode: t2.synchronizedOutput, wraparoundMode: t2.wraparound };
  }
  get options() {
    return this._publicOptions;
  }
  set options(t2) {
    for (let e in t2) this._publicOptions[e] = t2[e];
  }
  blur() {
    this._core.blur();
  }
  focus() {
    this._core.focus();
  }
  input(t2, e = true) {
    this._core.input(t2, e);
  }
  resize(t2, e) {
    this._verifyIntegers(t2, e), this._core.resize(t2, e);
  }
  open(t2) {
    this._core.open(t2);
  }
  attachCustomKeyEventHandler(t2) {
    this._core.attachCustomKeyEventHandler(t2);
  }
  attachCustomWheelEventHandler(t2) {
    this._core.attachCustomWheelEventHandler(t2);
  }
  registerLinkProvider(t2) {
    return this._core.registerLinkProvider(t2);
  }
  registerCharacterJoiner(t2) {
    return this._checkProposedApi(), this._core.registerCharacterJoiner(t2);
  }
  deregisterCharacterJoiner(t2) {
    this._checkProposedApi(), this._core.deregisterCharacterJoiner(t2);
  }
  registerMarker(t2 = 0) {
    return this._verifyIntegers(t2), this._core.registerMarker(t2);
  }
  registerDecoration(t2) {
    return this._checkProposedApi(), this._verifyPositiveIntegers(t2.x ?? 0, t2.width ?? 0, t2.height ?? 0), this._core.registerDecoration(t2);
  }
  hasSelection() {
    return this._core.hasSelection();
  }
  select(t2, e, i) {
    this._verifyIntegers(t2, e, i), this._core.select(t2, e, i);
  }
  getSelection() {
    return this._core.getSelection();
  }
  getSelectionPosition() {
    return this._core.getSelectionPosition();
  }
  clearSelection() {
    this._core.clearSelection();
  }
  selectAll() {
    this._core.selectAll();
  }
  selectLines(t2, e) {
    this._verifyIntegers(t2, e), this._core.selectLines(t2, e);
  }
  dispose() {
    super.dispose();
  }
  scrollLines(t2) {
    this._verifyIntegers(t2), this._core.scrollLines(t2);
  }
  scrollPages(t2) {
    this._verifyIntegers(t2), this._core.scrollPages(t2);
  }
  scrollToTop() {
    this._core.scrollToTop();
  }
  scrollToBottom() {
    this._core.scrollToBottom();
  }
  scrollToLine(t2) {
    this._verifyIntegers(t2), this._core.scrollToLine(t2);
  }
  clear() {
    this._core.clear();
  }
  write(t2, e) {
    this._core.write(t2, e);
  }
  writeln(t2, e) {
    this._core.write(t2), this._core.write(`\r
`, e);
  }
  paste(t2) {
    this._core.paste(t2);
  }
  refresh(t2, e) {
    this._verifyIntegers(t2, e), this._core.refresh(t2, e);
  }
  reset() {
    this._core.reset();
  }
  clearTextureAtlas() {
    this._core.clearTextureAtlas();
  }
  loadAddon(t2) {
    this._addonManager.loadAddon(this, t2);
  }
  static get strings() {
    return { get promptLabel() {
      return mi.get();
    }, set promptLabel(t2) {
      mi.set(t2);
    }, get tooMuchOutput() {
      return _i.get();
    }, set tooMuchOutput(t2) {
      _i.set(t2);
    } };
  }
  _verifyIntegers(...t2) {
    for (Ue of t2) if (Ue === 1 / 0 || isNaN(Ue) || Ue % 1 !== 0) throw new Error("This API only accepts integers");
  }
  _verifyPositiveIntegers(...t2) {
    for (Ue of t2) if (Ue && (Ue === 1 / 0 || isNaN(Ue) || Ue % 1 !== 0 || Ue < 0)) throw new Error("This API only accepts positive integers");
  }
};

// ../../../dsh-ssh-research/node_modules/@xterm/addon-fit/lib/addon-fit.mjs
var h = 2;
var _ = 1;
var o = class {
  activate(e) {
    this._terminal = e;
  }
  dispose() {
  }
  fit() {
    let e = this.proposeDimensions();
    if (!e || !this._terminal || isNaN(e.cols) || isNaN(e.rows)) return;
    let t2 = this._terminal._core;
    (this._terminal.rows !== e.rows || this._terminal.cols !== e.cols) && (t2._renderService.clear(), this._terminal.resize(e.cols, e.rows));
  }
  proposeDimensions() {
    if (!this._terminal || !this._terminal.element || !this._terminal.element.parentElement) return;
    let t2 = this._terminal._core._renderService.dimensions;
    if (t2.css.cell.width === 0 || t2.css.cell.height === 0) return;
    let s15 = this._terminal.options.scrollback === 0 ? 0 : this._terminal.options.overviewRuler?.width || 14, r = window.getComputedStyle(this._terminal.element.parentElement), l = parseInt(r.getPropertyValue("height")), a = Math.max(0, parseInt(r.getPropertyValue("width"))), i = window.getComputedStyle(this._terminal.element), n = { top: parseInt(i.getPropertyValue("padding-top")), bottom: parseInt(i.getPropertyValue("padding-bottom")), right: parseInt(i.getPropertyValue("padding-right")), left: parseInt(i.getPropertyValue("padding-left")) }, m = n.top + n.bottom, d = n.right + n.left, c = l - m, p = a - d - s15;
    return { cols: Math.max(h, Math.floor(p / t2.css.cell.width)), rows: Math.max(_, Math.floor(c / t2.css.cell.height)) };
  }
};

// src/client/panel/xterm.css.ts
var XTERM_CSS = `/**
 * Copyright (c) 2014 The xterm.js authors. All rights reserved.
 * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
 * https://github.com/chjj/term.js
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Originally forked from (with the author's permission):
 *   Fabrice Bellard's javascript vt100 for jslinux:
 *   http://bellard.org/jslinux/
 *   Copyright (c) 2011 Fabrice Bellard
 *   The original design remains. The terminal itself
 *   has been extended to include xterm CSI codes, among
 *   other features.
 */

/**
 *  Default styles for xterm.js
 */

.xterm {
    cursor: text;
    position: relative;
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
}

.xterm.focus,
.xterm:focus {
    outline: none;
}

.xterm .xterm-helpers {
    position: absolute;
    top: 0;
    /**
     * The z-index of the helpers must be higher than the canvases in order for
     * IMEs to appear on top.
     */
    z-index: 5;
}

.xterm .xterm-helper-textarea {
    padding: 0;
    border: 0;
    margin: 0;
    /* Move textarea out of the screen to the far left, so that the cursor is not visible */
    position: absolute;
    opacity: 0;
    left: -9999em;
    top: 0;
    width: 0;
    height: 0;
    z-index: -5;
    /** Prevent wrapping so the IME appears against the textarea at the correct position */
    white-space: nowrap;
    overflow: hidden;
    resize: none;
}

.xterm .composition-view {
    /* TODO: Composition position got messed up somewhere */
    background: #000;
    color: #FFF;
    display: none;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
}

.xterm .composition-view.active {
    display: block;
}

.xterm .xterm-viewport {
    /* On OS X this is required in order for the scroll bar to appear fully opaque */
    background-color: #000;
    overflow-y: scroll;
    cursor: default;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
}

.xterm .xterm-screen {
    position: relative;
}

.xterm .xterm-screen canvas {
    position: absolute;
    left: 0;
    top: 0;
}

.xterm-char-measure-element {
    display: inline-block;
    visibility: hidden;
    position: absolute;
    top: 0;
    left: -9999em;
    line-height: normal;
}

.xterm.enable-mouse-events {
    /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
    cursor: default;
}

.xterm.xterm-cursor-pointer,
.xterm .xterm-cursor-pointer {
    cursor: pointer;
}

.xterm.column-select.focus {
    /* Column selection mode */
    cursor: crosshair;
}

.xterm .xterm-accessibility:not(.debug),
.xterm .xterm-message {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    color: transparent;
    pointer-events: none;
}

.xterm .xterm-accessibility-tree:not(.debug) *::selection {
  color: transparent;
}

.xterm .xterm-accessibility-tree {
  font-family: monospace;
  user-select: text;
  white-space: pre;
}

.xterm .xterm-accessibility-tree > div {
  transform-origin: left;
  width: fit-content;
}

.xterm .live-region {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.xterm-dim {
    /* Dim should not apply to background, so the opacity of the foreground color is applied
     * explicitly in the generated class and reset to 1 here */
    opacity: 1 !important;
}

.xterm-underline-1 { text-decoration: underline; }
.xterm-underline-2 { text-decoration: double underline; }
.xterm-underline-3 { text-decoration: wavy underline; }
.xterm-underline-4 { text-decoration: dotted underline; }
.xterm-underline-5 { text-decoration: dashed underline; }

.xterm-overline {
    text-decoration: overline;
}

.xterm-overline.xterm-underline-1 { text-decoration: overline underline; }
.xterm-overline.xterm-underline-2 { text-decoration: overline double underline; }
.xterm-overline.xterm-underline-3 { text-decoration: overline wavy underline; }
.xterm-overline.xterm-underline-4 { text-decoration: overline dotted underline; }
.xterm-overline.xterm-underline-5 { text-decoration: overline dashed underline; }

.xterm-strikethrough {
    text-decoration: line-through;
}

.xterm-screen .xterm-decoration-container .xterm-decoration {
	z-index: 6;
	position: absolute;
}

.xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer {
	z-index: 7;
}

.xterm-decoration-overview-ruler {
    z-index: 8;
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
}

.xterm-decoration-top {
    z-index: 2;
    position: relative;
}



/* Derived from vs/base/browser/ui/scrollbar/media/scrollbar.css */

/* xterm.js customization: Override xterm's cursor style */
.xterm .xterm-scrollable-element > .scrollbar {
    cursor: default;
}

/* Arrows */
.xterm .xterm-scrollable-element > .scrollbar > .scra {
	cursor: pointer;
	font-size: 11px !important;
}

.xterm .xterm-scrollable-element > .visible {
	opacity: 1;

	/* Background rule added for IE9 - to allow clicks on dom node */
	background:rgba(0,0,0,0);

	transition: opacity 100ms linear;
	/* In front of peek view */
	z-index: 11;
}
.xterm .xterm-scrollable-element > .invisible {
	opacity: 0;
	pointer-events: none;
}
.xterm .xterm-scrollable-element > .invisible.fade {
	transition: opacity 800ms linear;
}

/* Scrollable Content Inset Shadow */
.xterm .xterm-scrollable-element > .shadow {
	position: absolute;
	display: none;
}
.xterm .xterm-scrollable-element > .shadow.top {
	display: block;
	top: 0;
	left: 3px;
	height: 3px;
	width: 100%;
	box-shadow: var(--vscode-scrollbar-shadow, #000) 0 6px 6px -6px inset;
}
.xterm .xterm-scrollable-element > .shadow.left {
	display: block;
	top: 3px;
	left: 0;
	height: 100%;
	width: 3px;
	box-shadow: var(--vscode-scrollbar-shadow, #000) 6px 0 6px -6px inset;
}
.xterm .xterm-scrollable-element > .shadow.top-left-corner {
	display: block;
	top: 0;
	left: 0;
	height: 3px;
	width: 3px;
}
.xterm .xterm-scrollable-element > .shadow.top.left {
	box-shadow: var(--vscode-scrollbar-shadow, #000) 6px 0 6px -6px inset;
}
`;

// src/client/panel/TerminalTab.tsx
var xtermCssInjected = false;
function ensureXtermCss() {
  if (xtermCssInjected || typeof document === "undefined") return;
  xtermCssInjected = true;
  if (document.querySelector("style[data-dsh-ssh-xterm]") !== null) return;
  const style = document.createElement("style");
  style.dataset.dshSshXterm = "";
  style.textContent = XTERM_CSS;
  document.head.appendChild(style);
}
var NO_FONT_SOURCE = {
  get: () => void 0,
  subscribe: () => () => void 0
};
function tabStateLabel(tab) {
  if (tab.authPrompt !== void 0) return tt("terminal.authPending");
  if (tab.status === "connecting") return tt("terminal.connecting");
  if (tab.status === "exited") return tt("terminal.tabExited");
  if (tab.closeError !== void 0) return tt("terminal.tabError");
  if (tab.status === "error") return tt("terminal.tabError");
  return void 0;
}
function challengeBelongsToLink(linkTabId, formTabId) {
  return linkTabId !== void 0 && linkTabId === formTabId;
}
function TerminalTab({ api, controller, presetAlias, terminalFont }) {
  const { terminalTabs, activeTerminalTabId, draftAlias } = (0, import_react4.useSyncExternalStore)(
    (0, import_react4.useCallback)((listener) => controller.subscribe(listener), [controller]),
    (0, import_react4.useCallback)(() => controller.getSnapshot(), [controller])
  );
  const [hosts, setHosts] = (0, import_react4.useState)([]);
  const [listError, setListError] = (0, import_react4.useState)(void 0);
  const containerRef = (0, import_react4.useRef)(null);
  const termRef = (0, import_react4.useRef)(null);
  const fitRef = (0, import_react4.useRef)(null);
  const linkRef = (0, import_react4.useRef)(null);
  const dataSubRef = (0, import_react4.useRef)(null);
  const renderedRef = (0, import_react4.useRef)(void 0);
  const closingRef = (0, import_react4.useRef)(/* @__PURE__ */ new Set());
  const fontSource = terminalFont ?? NO_FONT_SOURCE;
  const fontOverride = (0, import_react4.useSyncExternalStore)(fontSource.subscribe, fontSource.get);
  const activeTab = terminalTabs.find((tab) => tab.id === activeTerminalTabId);
  (0, import_react4.useEffect)(() => {
    ensureXtermCss();
  }, []);
  (0, import_react4.useEffect)(() => {
    const term = termRef.current;
    if (term === null) return;
    const next = resolveTerminalFontFamily(fontOverride);
    if (term.options.fontFamily === next) return;
    term.options.fontFamily = next;
    fitRef.current?.fit();
    const link = linkRef.current;
    if (link !== null) link.connection.resize(term.cols, term.rows);
  }, [fontOverride]);
  (0, import_react4.useEffect)(() => {
    let disposed = false;
    void (async () => {
      try {
        const list = await api.listHosts();
        if (!disposed) setHosts(list);
      } catch (cause) {
        if (!disposed) setListError(errorMessage(cause));
      }
    })();
    return () => {
      disposed = true;
    };
  }, [api]);
  (0, import_react4.useEffect)(() => {
    if (presetAlias === void 0 || presetAlias === "") return;
    controller.setDraftAlias(presetAlias);
  }, [presetAlias, controller]);
  (0, import_react4.useEffect)(() => {
    let lastCols = -1;
    let lastRows = -1;
    const sync = () => {
      const term = termRef.current;
      const fit = fitRef.current;
      if (term === null || fit === null) return;
      fit.fit();
      const link = linkRef.current;
      if (link !== null && (term.cols !== lastCols || term.rows !== lastRows)) {
        lastCols = term.cols;
        lastRows = term.rows;
        link.connection.resize(term.cols, term.rows);
      }
    };
    window.addEventListener("resize", sync);
    const container = containerRef.current;
    if (container === null || typeof ResizeObserver === "undefined") {
      return () => {
        window.removeEventListener("resize", sync);
      };
    }
    const observer = new ResizeObserver(() => {
      sync();
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);
  const ensureTerm = () => {
    const openTerm = termRef.current;
    const openFit = fitRef.current;
    if (openTerm !== null && openFit !== null) return { term: openTerm, fit: openFit };
    const container = containerRef.current;
    if (container === null) return void 0;
    const term = new Dl({
      convertEol: false,
      cursorBlink: true,
      fontSize: 13,
      fontFamily: resolveTerminalFontFamily(fontOverride),
      theme: { background: "#0b0e14", foreground: "#d8dee9", cursor: "#a3b8d0" }
    });
    const fit = new o();
    term.loadAddon(fit);
    term.open(container);
    fit.fit();
    termRef.current = term;
    fitRef.current = fit;
    dataSubRef.current = term.onData((data) => {
      linkRef.current?.connection.send(data);
    });
    return { term, fit };
  };
  const disposeTerm = () => {
    dataSubRef.current?.dispose();
    dataSubRef.current = null;
    termRef.current?.dispose();
    termRef.current = null;
    fitRef.current = null;
    renderedRef.current = void 0;
  };
  const releaseLink = () => {
    const link = linkRef.current;
    linkRef.current = null;
    if (link === null) return;
    const connection = link.connection;
    connection.onReady = void 0;
    connection.onOutput = void 0;
    connection.onExit = void 0;
    connection.onAuthPrompt = void 0;
    const tab = controller.terminalTab(link.tabId);
    if (tab === void 0) {
      controller.adoptTerminalLink(link.tabId, connection, "close");
      return;
    }
    if (tab.status === "connecting") {
      controller.adoptTerminalLink(link.tabId, connection, "detach");
      return;
    }
    connection.detach();
  };
  const needsScreenClear = (tabId) => {
    const rendered = renderedRef.current;
    return rendered !== void 0 && rendered !== tabId;
  };
  const drawRetained = (term, tabId, retained) => {
    if (needsScreenClear(tabId)) term.reset();
    if (retained !== "") term.write(retained);
    renderedRef.current = tabId;
  };
  const bindConnection = (tab, connection) => {
    const view = ensureTerm();
    if (view === void 0) return;
    linkRef.current = { tabId: tab.id, connection };
    renderedRef.current = tab.id;
    view.term.options.disableStdin = false;
    connection.onReady = (sessionId) => {
      controller.clearTerminalAuthPrompt(tab.id);
      controller.readyTerminalTab(tab.id, sessionId);
    };
    connection.onOutput = (data) => {
      view.term.write(data);
      controller.appendTerminalOutput(tab.id, data);
    };
    connection.onAuthPrompt = (name, instructions, prompts) => {
      controller.setTerminalAuthPrompt(tab.id, { name, instructions, prompts });
    };
    connection.onExit = (_code, error) => {
      const bound = linkRef.current;
      const wasBound = bound !== null && bound.connection === connection;
      if (wasBound) linkRef.current = null;
      connection.onReady = void 0;
      connection.onOutput = void 0;
      connection.onAuthPrompt = void 0;
      connection.onExit = void 0;
      view.term.options.disableStdin = true;
      if (!wasBound) return;
      controller.exitTerminalTab(tab.id, error);
    };
  };
  const bindTab = (tab) => {
    const view = ensureTerm();
    if (view === void 0) return;
    if (tab.status === "connecting" || tab.status === "connected" && tab.sessionId !== void 0) {
      const adopted = controller.reclaimTerminalLink(tab.id);
      if (adopted !== void 0) {
        drawRetained(view.term, tab.id, controller.readTerminalOutput(tab.id));
        bindConnection(tab, adopted);
        return;
      }
    }
    if (tab.status === "connecting") {
      drawRetained(view.term, tab.id, "");
      controller.clearTerminalOutput(tab.id);
      bindConnection(tab, api.openTerminal(tab.alias, view.term.cols, view.term.rows));
      return;
    }
    if (tab.status === "connected" && tab.sessionId !== void 0) {
      const sessionId = tab.sessionId;
      if (needsScreenClear(tab.id)) {
        view.term.reset();
        controller.clearTerminalOutput(tab.id);
        renderedRef.current = tab.id;
      }
      bindConnection(tab, api.attachTerminal(sessionId, view.term.cols, view.term.rows));
      return;
    }
    view.term.options.disableStdin = true;
    if (renderedRef.current === tab.id) return;
    drawRetained(view.term, tab.id, controller.readTerminalOutput(tab.id));
  };
  (0, import_react4.useEffect)(() => {
    const bound = linkRef.current;
    if (bound !== null && bound.tabId === activeTerminalTabId) return;
    releaseLink();
    if (activeTerminalTabId === void 0) {
      disposeTerm();
      return;
    }
    const tab = controller.terminalTab(activeTerminalTabId);
    if (tab === void 0) return;
    bindTab(tab);
  }, [activeTerminalTabId, activeTab?.status, activeTab?.sessionId]);
  (0, import_react4.useEffect)(() => () => {
    releaseLink();
    disposeTerm();
  }, []);
  const connect = () => {
    const target = draftAlias;
    if (target === "") return;
    controller.openTerminalTab(target);
  };
  const closeTab = (tabId) => {
    const tab = controller.terminalTab(tabId);
    if (tab === void 0) return;
    const bound = linkRef.current;
    if (bound !== null && bound.tabId === tabId) {
      linkRef.current = null;
      const connection = bound.connection;
      connection.onReady = void 0;
      connection.onOutput = void 0;
      connection.onExit = void 0;
      connection.onAuthPrompt = void 0;
      if (tab.status === "connecting") controller.adoptTerminalLink(tabId, connection, "close");
      else connection.close();
      controller.closeTerminalTab(tabId);
      return;
    }
    if (tab.status === "connected" && tab.sessionId !== void 0) {
      if (closingRef.current.has(tabId)) return;
      closingRef.current.add(tabId);
      const sessionId = tab.sessionId;
      void (async () => {
        try {
          const gone = await api.closeTerminalSession(sessionId);
          if (gone) {
            controller.closeTerminalTab(tabId);
            return;
          }
          controller.markTerminalCloseFailed(tabId, "undelivered");
        } finally {
          closingRef.current.delete(tabId);
        }
      })();
      return;
    }
    controller.closeTerminalTab(tabId);
  };
  const submitAuth = (e) => {
    e?.preventDefault();
    const link = linkRef.current;
    const tab = activeTab;
    if (link === null || tab === void 0 || tab.authPrompt === void 0) return;
    if (!challengeBelongsToLink(link.tabId, tab.id)) return;
    link.connection.sendAuthResponse(tab.authAnswers ?? []);
    controller.clearTerminalAuthPrompt(tab.id);
  };
  const stateLabel = activeTab === void 0 ? void 0 : tabStateLabel(activeTab);
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.termBody }, terminalTabs.length > 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.termTabs, role: "tablist", "aria-label": tt("terminal.tabs"), "data-dsh-part": "tab-bar" }, terminalTabs.map((tab) => {
    const label = tabStateLabel(tab);
    return /* @__PURE__ */ React.createElement("div", { key: tab.id, className: panel_default.termTab, "data-active": tab.id === activeTab?.id ? "" : void 0 }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        role: "tab",
        className: panel_default.termTabLabel,
        "aria-selected": tab.id === activeTab?.id,
        "data-dsh-part": "tab",
        title: tab.alias,
        onClick: () => {
          controller.setActiveTerminalTab(tab.id);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: panel_default.termTabAlias }, tab.alias),
      label !== void 0 && /* @__PURE__ */ React.createElement("span", { className: panel_default.termTabState, "data-state": tab.status }, label)
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: panel_default.termTabClose,
        "aria-label": tt("terminal.closeTab"),
        title: tt("terminal.closeTab"),
        onClick: () => {
          closeTab(tab.id);
        }
      },
      /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\xD7")
    ));
  }), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: panel_default.termTabNew,
      "aria-label": tt("terminal.newTab"),
      title: tt("terminal.newTab"),
      disabled: draftAlias === "",
      onClick: connect
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "+")
  )), /* @__PURE__ */ React.createElement("div", { className: panel_default.controls }, /* @__PURE__ */ React.createElement("select", { className: panel_default.input, value: draftAlias, onChange: (event) => {
    controller.setDraftAlias(event.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, tt("terminal.selectHost")), hosts.map((host) => /* @__PURE__ */ React.createElement("option", { key: host.alias, value: host.alias }, host.alias, " (", host.host, ")"))), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.primaryButton, disabled: draftAlias === "", onClick: connect }, tt("terminal.connect")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, disabled: activeTab === void 0, onClick: () => {
    if (activeTab !== void 0) closeTab(activeTab.id);
  } }, tt("terminal.disconnect"))), activeTab?.status === "connecting" && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "info" }, tt("terminal.connecting")), activeTab?.status === "connected" && stateLabel === void 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "ok" }, tt("terminal.ready", { alias: activeTab.alias })), activeTab?.status === "exited" && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "info" }, tt("terminal.exited", { alias: activeTab.alias }), activeTab.detail !== void 0 ? " (" + activeTab.detail + ")" : ""), activeTab?.status === "error" && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error" }, tt("terminal.error", { error: activeTab.detail ?? "" })), activeTab?.closeError !== void 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error" }, tt("terminal.closeFailed")), listError !== void 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error" }, tt("terminal.error", { error: listError })), /* @__PURE__ */ React.createElement("div", { className: panel_default.termWrap }, /* @__PURE__ */ React.createElement("div", { ref: containerRef, className: panel_default.termContainer, "data-dsh-part": "terminal" }), terminalTabs.length === 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.termPlaceholder }, hosts.length === 0 ? tt("hosts.empty") : tt("terminal.placeholder")), activeTab?.authPrompt !== void 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.modalBackdrop, style: { position: "absolute", zIndex: 10 } }, /* @__PURE__ */ React.createElement("form", { className: panel_default.modalCard, style: { maxWidth: 420 }, onSubmit: submitAuth }, /* @__PURE__ */ React.createElement("div", { className: panel_default.modalHeader }, /* @__PURE__ */ React.createElement("h3", { className: panel_default.modalTitle }, activeTab.authPrompt.name || tt("terminal.auth.title"))), /* @__PURE__ */ React.createElement("p", { className: panel_default.hint }, activeTab.authPrompt.instructions || tt("terminal.auth.hint")), activeTab.authPrompt.prompts.map((p, idx) => /* @__PURE__ */ React.createElement("label", { key: idx, className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, p.prompt.trim() || tt("terminal.auth.title")), /* @__PURE__ */ React.createElement(
    "input",
    {
      autoFocus: idx === 0,
      className: panel_default.input,
      type: p.echo ? "text" : "password",
      placeholder: tt("terminal.auth.placeholder"),
      value: activeTab.authAnswers?.[idx] ?? "",
      onChange: (event) => {
        controller.setTerminalAuthAnswer(activeTab.id, idx, event.target.value);
      }
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: panel_default.modalFooter }, /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, onClick: () => {
    if (activeTab !== void 0) closeTab(activeTab.id);
  } }, tt("terminal.auth.cancel")), /* @__PURE__ */ React.createElement("button", { type: "submit", className: panel_default.primaryButton }, tt("terminal.auth.submit")))))));
}

// src/client/panel/TransferTab.tsx
var import_react6 = require("react");

// src/client/panel/ResultPreview.tsx
var import_react5 = require("react");
var PREVIEW_ROWS = 200;
var PREVIEW_COLUMNS = 100;
var PREVIEW_CELLS = 1e4;
var MAX_BYTES = 2 * 1024 * 1024;
function previewCopy(zh3, en3) {
  return tt("transfer.download") === "Download" ? en3 : zh3;
}
function parsePreviewCsv(source) {
  const text = source.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  let closed = false;
  let atStart = true;
  let columns = 0;
  let cells = 0;
  let totalRows = 0;
  let truncated = false;
  const fieldEnd = () => {
    columns++;
    if (totalRows < PREVIEW_ROWS && columns <= PREVIEW_COLUMNS && cells < PREVIEW_CELLS) {
      row.push(field);
      cells++;
    } else truncated = true;
    field = "";
    atStart = true;
    closed = false;
  };
  const rowEnd = () => {
    fieldEnd();
    if (totalRows < PREVIEW_ROWS && row.length > 0) rows.push(row);
    totalRows++;
    row = [];
    columns = 0;
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else field += char;
    } else if (char === ",") fieldEnd();
    else if (char === "\r" || char === "\n") {
      rowEnd();
      if (char === "\r" && text[i + 1] === "\n") i++;
    } else if (char === '"' && atStart && !closed) {
      quoted = true;
      atStart = false;
    } else {
      if (closed || char === '"') throw new Error(previewCopy("CSV \u5F15\u53F7\u683C\u5F0F\u65E0\u6548\u3002", "Invalid CSV quoting."));
      atStart = false;
      field += char;
    }
  }
  if (quoted) throw new Error(previewCopy("CSV \u5F15\u53F7\u672A\u95ED\u5408\u3002", "Unclosed CSV quote."));
  if (text.length > 0 && (field !== "" || !atStart || columns > 0 || closed)) rowEnd();
  return { rows, totalRows, truncated };
}
function validRasterDataUrl(mime, dataUrl) {
  return ["image/png", "image/jpeg", "image/gif", "image/webp", "image/bmp"].includes(mime) && dataUrl.startsWith(`data:${mime};base64,`) && /^[A-Za-z0-9+/]+={0,2}$/.test(dataUrl.slice(dataUrl.indexOf(",") + 1)) && dataUrl.length <= Math.ceil(MAX_BYTES / 3) * 4 + 64;
}
function decodePreview(body) {
  const invalid = () => {
    throw new Error(previewCopy("\u9884\u89C8\u54CD\u5E94\u65E0\u6548\u6216\u8D85\u8FC7 2 MiB\u3002", "Invalid preview response or file exceeds 2 MiB."));
  };
  if (typeof body !== "object" || body === null) return invalid();
  const value = body;
  if (typeof value.error === "string") throw new Error(value.error);
  if (typeof value.name !== "string" || typeof value.mime !== "string") return invalid();
  if (value.kind === "image" && typeof value.dataUrl === "string" && validRasterDataUrl(value.mime, value.dataUrl)) {
    return { kind: "image", name: value.name, mime: value.mime, dataUrl: value.dataUrl };
  }
  if ((value.kind === "text" || value.kind === "csv") && typeof value.content === "string" && new TextEncoder().encode(value.content).length <= MAX_BYTES) {
    return { kind: value.kind, name: value.name, mime: value.mime, content: value.content };
  }
  return invalid();
}
function ResultPreview({ alias, path, onClose, onDownload, downloading }) {
  const [refresh, setRefresh] = (0, import_react5.useState)(0);
  const [state, setState] = (0, import_react5.useState)({ key: "" });
  const key = JSON.stringify([alias, path, refresh]);
  (0, import_react5.useEffect)(() => {
    const controller = new AbortController();
    let active = true;
    setState({ key });
    void (async () => {
      try {
        const query2 = new URLSearchParams({ alias, path });
        const response = await fetch(`/api/dsh-ssh/preview?${query2}`, { signal: controller.signal, cache: "no-store" });
        const body = await response.json();
        const value2 = decodePreview(body);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (active) setState({ key, value: value2 });
      } catch (cause) {
        if (active) setState({ key, error: errorMessage(cause) });
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, [alias, path, key]);
  const value = state.key === key ? state.value : void 0;
  const error = state.key === key ? state.error : void 0;
  const csv = (0, import_react5.useMemo)(() => {
    if (value?.kind !== "csv") return void 0;
    try {
      return parsePreviewCsv(value.content);
    } catch (cause) {
      return errorMessage(cause);
    }
  }, [value]);
  const loading = value === void 0 && error === void 0;
  return /* @__PURE__ */ React.createElement("section", { className: panel_default.previewPanel, "aria-label": previewCopy("\u6587\u4EF6\u9884\u89C8", "File preview"), "aria-busy": loading }, /* @__PURE__ */ React.createElement("div", { className: panel_default.previewHeader }, /* @__PURE__ */ React.createElement("strong", { className: panel_default.previewTitle }, previewCopy("\u6587\u4EF6\u9884\u89C8", "File preview"), ": ", value?.name ?? path), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, onClick: () => {
    setRefresh((n) => n + 1);
  } }, tt("transfer.refresh")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, disabled: downloading, onClick: onDownload }, tt("transfer.download")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, onClick: onClose }, previewCopy("\u5173\u95ED\u9884\u89C8", "Close preview"))), /* @__PURE__ */ React.createElement("div", { className: panel_default.hint }, alias, ": ", path, " \xB7 ", previewCopy("\u9884\u89C8\u4E0A\u9650 2 MiB\uFF1B\u4E0B\u8F7D\u53EF\u83B7\u53D6\u5B8C\u6574\u6587\u4EF6\u3002", "Preview limit: 2 MiB. Download for the complete file.")), loading && /* @__PURE__ */ React.createElement("div", { className: panel_default.loading, role: "status" }, previewCopy("\u6B63\u5728\u52A0\u8F7D\u9884\u89C8\u2026", "Loading preview\u2026")), error !== void 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error", role: "alert" }, error), value?.kind === "text" && /* @__PURE__ */ React.createElement("pre", { className: panel_default.previewText }, value.content), value?.kind === "image" && /* @__PURE__ */ React.createElement("img", { className: panel_default.previewImage, src: value.dataUrl, alt: value.name, onError: () => {
    setState((previous) => previous.key === key ? { key, error: previewCopy("\u56FE\u7247\u65E0\u6CD5\u89E3\u7801\u3002", "Unable to decode image.") } : previous);
  } }), typeof csv === "string" && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error", role: "alert" }, csv), csv !== void 0 && typeof csv !== "string" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: panel_default.hint }, previewCopy(`\u5171 ${csv.totalRows} \u884C\uFF1B\u6700\u591A\u663E\u793A ${PREVIEW_ROWS} \u884C\u3001${PREVIEW_COLUMNS} \u5217\u3001${PREVIEW_CELLS} \u4E2A\u5355\u5143\u683C\uFF08\u9996\u884C\u6309\u539F\u6837\u663E\u793A\uFF09\u3002`, `${csv.totalRows} rows; showing up to ${PREVIEW_ROWS} rows, ${PREVIEW_COLUMNS} columns and ${PREVIEW_CELLS} cells (first row shown as data).`), " ", csv.truncated && previewCopy("\u8868\u683C\u5DF2\u622A\u65AD\uFF0C\u8BF7\u4E0B\u8F7D\u67E5\u770B\u5B8C\u6574\u6570\u636E\u3002", "Table truncated. Download for complete data.")), /* @__PURE__ */ React.createElement("div", { className: panel_default.previewTableWrap }, /* @__PURE__ */ React.createElement("table", { className: `${panel_default.table} ${panel_default.previewTable}`, "aria-label": value?.name }, /* @__PURE__ */ React.createElement("tbody", null, csv.rows.map((row, index) => /* @__PURE__ */ React.createElement("tr", { key: index }, row.map((cell, col) => /* @__PURE__ */ React.createElement("td", { key: col }, cell)))))))));
}

// src/client/panel/TransferTab.tsx
function joinRemotePath(dir, name) {
  const base = dir.endsWith("/") ? dir : dir + "/";
  return base + name;
}
function parentOf(dir) {
  const trimmed = dir.replace(/\/+$/, "");
  const index = trimmed.lastIndexOf("/");
  if (index <= 0) return "/";
  return trimmed.slice(0, index);
}
function formatBytes(bytes) {
  if (bytes < 1024) return tt("transfer.bytes", { value: bytes });
  if (bytes < 1024 * 1024) return tt("transfer.kib", { value: (bytes / 1024).toFixed(1) });
  if (bytes < 1024 * 1024 * 1024) return tt("transfer.mib", { value: (bytes / (1024 * 1024)).toFixed(1) });
  return tt("transfer.gib", { value: (bytes / (1024 * 1024 * 1024)).toFixed(1) });
}
function TransferTab({ api }) {
  const [hosts, setHosts] = (0, import_react6.useState)([]);
  const [listError, setListError] = (0, import_react6.useState)(null);
  const [alias, setAlias] = (0, import_react6.useState)("");
  const [remotePath, setRemotePath] = (0, import_react6.useState)("");
  const [browseOpen, setBrowseOpen] = (0, import_react6.useState)(false);
  const [previewPath, setPreviewPath] = (0, import_react6.useState)(null);
  const [browseDir, setBrowseDir] = (0, import_react6.useState)("/");
  const [entries, setEntries] = (0, import_react6.useState)([]);
  const [browsing, setBrowsing] = (0, import_react6.useState)(false);
  const [transfer, setTransfer] = (0, import_react6.useState)(null);
  const [status, setStatus] = (0, import_react6.useState)(null);
  const fileRef = (0, import_react6.useRef)(null);
  const selectedFilePath = (0, import_react6.useRef)(null);
  const seqRef = (0, import_react6.useRef)(0);
  (0, import_react6.useEffect)(() => {
    let disposed = false;
    void (async () => {
      try {
        const list = await api.listHosts();
        if (!disposed) setHosts(list);
      } catch (cause) {
        if (!disposed) setListError(errorMessage(cause));
      }
    })();
    return () => {
      disposed = true;
    };
  }, [api]);
  const loadDir = async (path) => {
    if (alias === "") return;
    const seq = ++seqRef.current;
    setBrowsing(true);
    setListError(null);
    try {
      const list = await api.ls(alias, path);
      if (seq !== seqRef.current) return;
      const sorted = [...list].sort((a, b2) => {
        if (a.type !== b2.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b2.name);
      });
      setEntries(sorted);
      setBrowseDir(path);
      setListError(null);
    } catch (cause) {
      if (seq === seqRef.current) setListError(errorMessage(cause));
    } finally {
      if (seq === seqRef.current) setBrowsing(false);
    }
  };
  const openBrowse = () => {
    if (alias === "") return;
    setBrowseOpen(true);
    const path = remotePath.trim() === "" ? "/" : remotePath.trim();
    void loadDir(path === selectedFilePath.current ? parentOf(path) : path);
  };
  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file === void 0 || alias === "" || remotePath.trim() === "" || transfer !== null) return;
    setStatus(null);
    setTransfer({ kind: "upload", phase: "connecting", percent: 0, file: file.name });
    try {
      const outcome = await api.uploadFile(file, alias, remotePath.trim(), (progress) => {
        setTransfer((prev) => prev === null ? prev : {
          kind: "upload",
          phase: progress.phase,
          percent: progress.percent,
          speedBps: progress.speedBps,
          file: progress.file
        });
      });
      setStatus({ kind: "ok", bytes: outcome.transferredBytes });
    } catch (cause) {
      setStatus({ kind: "error", error: errorMessage(cause) });
    } finally {
      setTransfer(null);
    }
  };
  const handleDownload = async (path = remotePath.trim()) => {
    if (alias === "" || path === "" || transfer !== null) return;
    setStatus(null);
    setTransfer({ kind: "download", phase: "connecting", percent: 0, file: path });
    try {
      const result = await api.downloadFile(alias, path, (progress) => {
        setTransfer((prev) => prev === null ? prev : {
          kind: "download",
          phase: progress.phase,
          percent: progress.percent,
          speedBps: progress.speedBps,
          file: progress.file
        });
      });
      if (!result.streamed && result.blob !== void 0) {
        const url = URL.createObjectURL(result.blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = result.filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1e4);
      }
      setStatus({ kind: "ok", bytes: result.bytes });
    } catch (cause) {
      setStatus({ kind: "error", error: errorMessage(cause) });
    } finally {
      setTransfer(null);
    }
  };
  const ready = alias !== "" && remotePath.trim() !== "" && transfer === null;
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.tabBody }, /* @__PURE__ */ React.createElement("div", { className: panel_default.controls }, /* @__PURE__ */ React.createElement("select", { className: panel_default.input, value: alias, onChange: (event) => {
    ++seqRef.current;
    selectedFilePath.current = null;
    setAlias(event.target.value);
    setPreviewPath(null);
    setEntries([]);
    setBrowseOpen(false);
    setBrowseDir("/");
    setBrowsing(false);
    setListError(null);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, tt("transfer.selectHost")), hosts.map((host) => /* @__PURE__ */ React.createElement("option", { key: host.alias, value: host.alias }, host.alias, " (", host.host, ")"))), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, placeholder: tt("transfer.remotePathHint"), value: remotePath, onChange: (event) => {
    setRemotePath(event.target.value);
  } }), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, disabled: alias === "", onClick: openBrowse }, tt("transfer.browseRemote")), /* @__PURE__ */ React.createElement("div", { className: panel_default.toolbarSpacer }), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.primaryButton, disabled: !ready, onClick: () => {
    fileRef.current?.click();
  } }, tt("transfer.upload")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, disabled: !ready, onClick: () => {
    void handleDownload();
  } }, tt("transfer.download")), /* @__PURE__ */ React.createElement("input", { ref: fileRef, type: "file", className: panel_default.hiddenFile, onChange: (event) => {
    void handleFile(event);
  } })), listError !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "error" }, tt("common.error", { error: listError })), browseOpen && /* @__PURE__ */ React.createElement("div", { className: panel_default.browsePanel }, /* @__PURE__ */ React.createElement("div", { className: panel_default.browseHeader }, /* @__PURE__ */ React.createElement("span", { className: panel_default.browsePath }, browseDir), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.linkButton, disabled: browsing, onClick: () => {
    void loadDir(browseDir);
  } }, tt("transfer.refresh"))), /* @__PURE__ */ React.createElement("div", { className: panel_default.browseList, "aria-busy": browsing }, browsing && /* @__PURE__ */ React.createElement("div", { className: panel_default.loading, role: "status" }, tt("common.loading")), !browsing && listError === null && entries.length === 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.empty, role: "status" }, previewCopy("\u6B64\u76EE\u5F55\u4E3A\u7A7A\u3002", "This directory is empty.")), !browsing && browseDir !== "/" && /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.dirRow, "data-up": true, onClick: () => {
    void loadDir(parentOf(browseDir));
  } }, /* @__PURE__ */ React.createElement("span", { className: panel_default.dirName }, tt("transfer.upLevel")), /* @__PURE__ */ React.createElement("span", { className: panel_default.dirType }), /* @__PURE__ */ React.createElement("span", { className: panel_default.dirSize })), !browsing && entries.map((entry) => /* @__PURE__ */ React.createElement("button", { key: entry.name, type: "button", className: panel_default.dirRow, "data-type": entry.type, onClick: () => {
    if (entry.type === "dir") {
      void loadDir(joinRemotePath(browseDir, entry.name));
    } else {
      const path = joinRemotePath(browseDir, entry.name);
      selectedFilePath.current = path;
      setRemotePath(path);
      setPreviewPath(path);
    }
  } }, /* @__PURE__ */ React.createElement("span", { className: panel_default.dirName }, entry.name), /* @__PURE__ */ React.createElement("span", { className: panel_default.dirType }, entry.type === "dir" ? "[" + tt("transfer.dir") + "]" : entry.type === "file" ? "[" + tt("transfer.file") + "]" : ""), /* @__PURE__ */ React.createElement("span", { className: panel_default.dirSize }, formatBytes(entry.size)))))), previewPath !== null && alias !== "" && /* @__PURE__ */ React.createElement(
    ResultPreview,
    {
      alias,
      path: previewPath,
      onClose: () => {
        setPreviewPath(null);
      },
      onDownload: () => {
        void handleDownload(previewPath);
      },
      downloading: transfer !== null
    }
  ), transfer !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.transferBlock }, /* @__PURE__ */ React.createElement("div", { className: panel_default.progressMeta }, /* @__PURE__ */ React.createElement("span", null, transfer.kind === "upload" ? tt("transfer.uploading", { file: transfer.file }) : tt("transfer.downloading")), /* @__PURE__ */ React.createElement("span", null, tt("transfer.percent", { value: Math.round(transfer.percent) })), transfer.speedBps !== void 0 && transfer.phase === "transferring" && /* @__PURE__ */ React.createElement("span", null, tt("transfer.speed", { value: formatBytes(transfer.speedBps) }))), /* @__PURE__ */ React.createElement("div", { className: panel_default.progressTrack }, /* @__PURE__ */ React.createElement("div", { className: panel_default.progressBar, style: { width: Math.min(100, Math.max(0, transfer.percent)) + "%" } }))), status !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": status.kind }, status.kind === "ok" ? tt("transfer.done", { bytes: status.bytes }) : tt("transfer.failed", { error: status.error })));
}

// src/client/panel/TunnelsTab.tsx
var import_react7 = require("react");
var TUNNEL_POLL_MS = 5e3;
function diffTunnels(prev, next) {
  if (prev === null) return next;
  if (prev.length !== next.length) return next;
  for (let index = 0; index < prev.length; index += 1) {
    const a = prev[index];
    const b2 = next[index];
    if (a.id !== b2.id || a.alias !== b2.alias || a.state !== b2.state || a.localPort !== b2.localPort || a.remoteHost !== b2.remoteHost || a.remotePort !== b2.remotePort || a.startedAt !== b2.startedAt || a.error !== b2.error) {
      return next;
    }
  }
  return null;
}
function TunnelsTab({ api, active = true }) {
  const [hosts, setHosts] = (0, import_react7.useState)([]);
  const [tunnels, setTunnels] = (0, import_react7.useState)(null);
  const [error, setError] = (0, import_react7.useState)(null);
  const [listError, setListError] = (0, import_react7.useState)(null);
  const [notice, setNotice] = (0, import_react7.useState)(null);
  const [alias, setAlias] = (0, import_react7.useState)("");
  const [remotePort, setRemotePort] = (0, import_react7.useState)("");
  const [remoteHost, setRemoteHost] = (0, import_react7.useState)("");
  const [localPort, setLocalPort] = (0, import_react7.useState)("");
  const [busy, setBusy] = (0, import_react7.useState)(false);
  (0, import_react7.useEffect)(() => {
    let disposed = false;
    void (async () => {
      try {
        const list = await api.listHosts();
        if (!disposed) setHosts(list);
      } catch {
      }
    })();
    return () => {
      disposed = true;
    };
  }, [api]);
  const seqRef = (0, import_react7.useRef)(0);
  const automaticRead = (0, import_react7.useRef)({ running: false });
  (0, import_react7.useEffect)(() => {
    if (!active) return;
    let disposed = false;
    const read = automaticRead.current;
    let timer;
    const load = async () => {
      if (disposed || read.running || document.visibilityState === "hidden") return;
      read.running = true;
      const seq = ++seqRef.current;
      try {
        const list = await api.listTunnels();
        if (disposed || seq !== seqRef.current) return;
        setTunnels((prev) => diffTunnels(prev, list) ?? prev);
        setListError(null);
      } catch (cause) {
        if (disposed || seq !== seqRef.current) return;
        setListError(errorMessage(cause));
      } finally {
        read.running = false;
        const resume2 = read.resume;
        read.resume = void 0;
        resume2?.();
      }
    };
    const resume = () => {
      if (disposed || document.visibilityState === "hidden") return;
      if (read.running) read.resume = resume;
      else void load();
    };
    const stop = () => {
      if (timer !== void 0) clearInterval(timer);
      timer = void 0;
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stop();
        if (read.resume === resume) read.resume = void 0;
      } else if (timer === void 0) {
        resume();
        timer = setInterval(() => {
          void load();
        }, TUNNEL_POLL_MS);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      disposed = true;
      seqRef.current += 1;
      if (read.resume === resume) read.resume = void 0;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [api, active]);
  const refresh = async () => {
    const seq = ++seqRef.current;
    try {
      const list = await api.listTunnels();
      if (seq !== seqRef.current) return;
      setTunnels(list);
      setListError(null);
    } catch (cause) {
      if (seq !== seqRef.current) return;
      setListError(errorMessage(cause));
    }
  };
  const stopTunnel = async (tunnelId) => {
    setError(null);
    try {
      await api.stopTunnel(tunnelId);
      await refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    }
  };
  const stopAll = async () => {
    if (!window.confirm(tt("tunnel.stopAllConfirm"))) return;
    setBusy(true);
    setError(null);
    try {
      await api.stopAllTunnels(alias === "" ? void 0 : alias);
      await refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  const start = async () => {
    if (alias === "" || remotePort.trim() === "") return;
    const remotePortNumber = Number(remotePort);
    const localPortNumber = localPort.trim() === "" ? void 0 : Number(localPort);
    if (!Number.isInteger(remotePortNumber) || remotePortNumber < 1 || remotePortNumber > 65535) {
      setError(tt("form.portInvalid"));
      return;
    }
    if (localPortNumber !== void 0 && (!Number.isInteger(localPortNumber) || localPortNumber < 1 || localPortNumber > 65535)) {
      setError(tt("form.portInvalid"));
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const tunnel = await api.startTunnel({
        alias,
        remotePort: remotePortNumber,
        remoteHost: remoteHost.trim() === "" ? void 0 : remoteHost.trim(),
        localPort: localPortNumber
      });
      setNotice(tt("tunnel.started", { localPort: tunnel.localPort }));
      setRemotePort("");
      setRemoteHost("");
      setLocalPort("");
      await refresh();
    } catch (cause) {
      setError(tt("tunnel.failed", { error: errorMessage(cause) }));
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.tabBody }, /* @__PURE__ */ React.createElement("div", { className: panel_default.controls }, /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, disabled: busy, onClick: () => {
    void stopAll();
  } }, tt("tunnel.stopAll")), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, onClick: () => {
    void refresh();
  } }, tt("common.refresh"))), /* @__PURE__ */ React.createElement("div", { className: panel_default.formCard }, /* @__PURE__ */ React.createElement("a", { className: panel_default.linkButton, href: "/port-mapper/", target: "_blank", rel: "noopener noreferrer" }, tt("tunnel.webServices")), /* @__PURE__ */ React.createElement("p", { className: panel_default.hint }, tt("tunnel.webHint"))), error !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, role: "alert", "data-kind": "error" }, error), listError !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, role: "alert", "data-kind": "error" }, listError), notice !== null && /* @__PURE__ */ React.createElement("div", { className: panel_default.banner, "data-kind": "ok" }, notice), tunnels !== null && tunnels.length === 0 && /* @__PURE__ */ React.createElement("div", { className: panel_default.empty }, tt("tunnel.empty")), /* @__PURE__ */ React.createElement("div", { className: panel_default.tunnelList }, (tunnels ?? []).map((tunnel) => /* @__PURE__ */ React.createElement("div", { key: tunnel.id, className: panel_default.tunnelRow, "data-state": tunnel.state }, /* @__PURE__ */ React.createElement("span", { className: panel_default.tunnelLabel }, tt("tunnel.row", { alias: tunnel.alias, localPort: tunnel.localPort, remoteHost: tunnel.remoteHost, remotePort: tunnel.remotePort })), /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.ghostButton, onClick: () => {
    void stopTunnel(tunnel.id);
  } }, tt("tunnel.stop"))))), /* @__PURE__ */ React.createElement("div", { className: panel_default.formCard }, /* @__PURE__ */ React.createElement("div", { className: panel_default.formRow }, /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("tunnel.alias")), /* @__PURE__ */ React.createElement("select", { className: panel_default.input, value: alias, onChange: (event) => {
    setAlias(event.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, tt("terminal.selectHost")), hosts.map((host) => /* @__PURE__ */ React.createElement("option", { key: host.alias, value: host.alias }, host.alias)))), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("tunnel.remotePort")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, type: "number", min: 1, max: 65535, value: remotePort, onChange: (event) => {
    setRemotePort(event.target.value);
  } })), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("tunnel.remoteHost")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, value: remoteHost, placeholder: tt("tunnel.remoteHostHint"), onChange: (event) => {
    setRemoteHost(event.target.value);
  } })), /* @__PURE__ */ React.createElement("label", { className: panel_default.field }, /* @__PURE__ */ React.createElement("span", { className: panel_default.fieldLabel }, tt("tunnel.localPort")), /* @__PURE__ */ React.createElement("input", { className: panel_default.input, type: "number", min: 1, max: 65535, value: localPort, placeholder: tt("tunnel.localPortHint"), onChange: (event) => {
    setLocalPort(event.target.value);
  } }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { type: "button", className: panel_default.primaryButton, disabled: busy || alias === "" || remotePort.trim() === "", onClick: () => {
    void start();
  } }, tt("tunnel.start")))));
}

// src/client/panel/SshPanel.tsx
var TABS = [
  { id: "hosts", label: () => tt("tab.hosts") },
  { id: "terminal", label: () => tt("tab.terminal") },
  { id: "transfer", label: () => tt("tab.transfer") },
  { id: "tunnels", label: () => tt("tab.tunnels") },
  { id: "cluster", label: () => tt("tab.cluster") }
];
function SshPanel({ controller, api, terminalFont }) {
  const { panelOpen, activeTab } = (0, import_react8.useSyncExternalStore)(
    (0, import_react8.useCallback)((listener) => controller.subscribe(listener), [controller]),
    (0, import_react8.useCallback)(() => controller.getSnapshot(), [controller])
  );
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.panel, "data-dsh-plugin": "ssh" }, /* @__PURE__ */ React.createElement("div", { className: panel_default.panelHeader }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: `${panel_default.ghostButton} ${panel_default.backButton}`,
      "aria-label": tt("panel.backToConversation"),
      "data-dsh-center-view-back": "",
      onClick: () => {
        controller.close();
      }
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u2039"),
    /* @__PURE__ */ React.createElement("span", null, tt("panel.backToConversation"))
  ), /* @__PURE__ */ React.createElement("h2", { className: panel_default.panelTitle }, tt("panel.title"))), /* @__PURE__ */ React.createElement("div", { className: panel_default.tabBar, role: "tablist", "data-dsh-part": "tab-bar" }, TABS.map((tab) => /* @__PURE__ */ React.createElement("button", { key: tab.id, type: "button", role: "tab", "aria-selected": activeTab === tab.id, "data-active": activeTab === tab.id ? "" : void 0, "data-dsh-part": "tab", className: panel_default.tab, onClick: () => {
    controller.setActiveTab(tab.id);
  } }, tab.label()))), /* @__PURE__ */ React.createElement("div", { className: panel_default.panelContent }, activeTab === "hosts" && /* @__PURE__ */ React.createElement(HostsTab, { api, onConnect: (alias) => {
    controller.requestConnect(alias);
  } }), activeTab === "terminal" && /* @__PURE__ */ React.createElement(TerminalTab, { api, controller, terminalFont }), activeTab === "transfer" && /* @__PURE__ */ React.createElement(TransferTab, { api }), activeTab === "tunnels" && /* @__PURE__ */ React.createElement(TunnelsTab, { api, active: panelOpen }), activeTab === "cluster" && /* @__PURE__ */ React.createElement(ClusterTab, { api })));
}

// src/client/native-panel.tsx
var PANEL_ORDER = 40;
function SshPanelIcon({ size }) {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      "data-dsh-panel-entry": SSH_PANEL_ID,
      viewBox: "0 0 16 16",
      width: size,
      height: size,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    },
    /* @__PURE__ */ React.createElement("rect", { x: "1.75", y: "2.25", width: "12.5", height: "11.5", rx: "1.75" }),
    /* @__PURE__ */ React.createElement("path", { d: "M4.25 5.25l2.75 2.75-2.75 2.75" }),
    /* @__PURE__ */ React.createElement("path", { d: "M8.5 10.75h3.25" })
  );
}
function SshPanelPage({ controller, api, terminalFont }) {
  return /* @__PURE__ */ React.createElement("div", { className: panel_default.view, "data-dsh-ssh-view": "", "data-dsh-plugin": "ssh" }, /* @__PURE__ */ React.createElement(SshPanel, { controller, api, terminalFont }));
}
function registerSshPanel(ctx, controller, api, terminalFont) {
  const slots = ctx.slots;
  const disposers = [];
  disposers.push(slots.inject("sidebar.panellist", () => slots.register({
    name: "sidebar.panellist",
    id: SSH_PANEL_ID,
    order: PANEL_ORDER,
    // The shell resolves this through resolveSlotLabel on every locale change,
    // so the module-level translate reads the active language at call time.
    label: () => tt("entry.label")
  }, SshPanelIcon)));
  disposers.push(slots.inject("main", () => slots.register({
    name: "main",
    key: SSH_PANEL_ID,
    inject: () => ({ controller, api, terminalFont })
  }, SshPanelPage)));
  return () => {
    for (const dispose of disposers.splice(0)) dispose();
  };
}

// src/client/settings-binding.ts
var PENDING_SNAPSHOT = {
  status: "loading",
  value: void 0,
  base: void 0,
  user: void 0,
  revision: void 0,
  writable: false
};
function carriesField(section, field) {
  return typeof section === "object" && section !== null && Object.hasOwn(section, field);
}
var SharedFormsReader = class {
  /**
   * @param forms - the shared configuration forms service (`ctx.configForms`).
   * @param field - the field this plugin's own schema declares, which is what identifies its entry.
   */
  constructor(forms, field) {
    this.forms = forms;
    this.field = field;
    this.unsubscribeMirror = forms.describe().subscribe(() => {
      this.bind();
      this.publish();
    });
    this.bind();
  }
  forms;
  field;
  listeners = /* @__PURE__ */ new Set();
  unsubscribeMirror;
  unsubscribeForm;
  form;
  snapshot = PENDING_SNAPSHOT;
  getSnapshot() {
    return this.snapshot;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  /** Release the mirror and form subscriptions and drop every listener. */
  dispose() {
    this.unsubscribeMirror();
    this.unsubscribeForm?.();
    this.unsubscribeForm = void 0;
    this.listeners.clear();
  }
  /** Bind the entry form once the shared mirror names this plugin's entry. */
  bind() {
    if (this.form !== void 0) return;
    const namespaces = this.forms.describe().getSnapshot().view?.namespaces;
    const entry = namespaces?.find((candidate) => carriesField(candidate.value, this.field));
    if (entry === void 0) return;
    const form = this.forms.get(entry.ns);
    if (form === void 0) return;
    this.form = form;
    this.snapshot = form.getSnapshot();
    this.unsubscribeForm = form.subscribe(() => {
      this.snapshot = form.getSnapshot();
      this.publish();
    });
  }
  publish() {
    for (const listener of this.listeners) listener();
  }
};
function bindSettingsReader(ctx, namespace, field) {
  const family = ctx.get("webUiSettings");
  if (family !== void 0) {
    const form = family.bind({ namespace });
    return {
      getSnapshot: () => form.getSnapshot(),
      subscribe: (listener) => form.subscribe(listener),
      dispose: () => {
      }
    };
  }
  return new SharedFormsReader(ctx.configForms, field);
}

// src/client/index.ts
var NS = "dsh-ssh";
var SETTINGS_NS = "dsh-ssh";
var TERMINAL_FONT_FIELD = "terminalFontFamily";
var inject = ["slots", "locale", "configForms", "layout"];
function apply(ctx) {
  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en });
    } catch {
      return () => {
      };
    }
  }, "dsh-ssh: dictionaries");
  try {
    setRuntimeTranslate(ctx.locale.bind(NS));
  } catch {
  }
  const controller = new PanelController({
    panel: {
      select: (panelId) => {
        const layout = ctx.get?.("layout");
        layout?.selectPanel?.(panelId);
      }
    }
  });
  const api = new SshApi();
  const settings = bindSettingsReader(ctx, SETTINGS_NS, TERMINAL_FONT_FIELD);
  const terminalFont = {
    get: () => {
      const snapshot = settings.getSnapshot();
      return snapshot.status === "ready" ? snapshot.value?.terminalFontFamily : void 0;
    },
    subscribe: (listener) => settings.subscribe(listener)
  };
  ctx.effect(() => () => {
    settings.dispose();
  }, "dsh-ssh: settings binding");
  const disposers = [];
  try {
    disposers.push(registerSshPanel(ctx, controller, api, terminalFont));
    const layoutFace = ctx.get?.("layout");
    if (layoutFace?.panelInfo !== void 0) {
      const sync = () => {
        const active = layoutFace.panelInfo.getSnapshot().activePanelId;
        controller.syncPanelSelection(active === SSH_PANEL_ID ? SSH_PANEL_ID : null);
      };
      sync();
      disposers.push(layoutFace.panelInfo.subscribe(sync));
    }
  } catch (error) {
    console.warn("[dsh-ssh] panel registration failed:", error);
  }
  ctx.effect(() => () => {
    for (const dispose of disposers.splice(0)) dispose();
  }, "dsh-ssh: ui mounts");
}
/*! Bundled license information:

@xterm/xterm/lib/xterm.mjs:
@xterm/addon-fit/lib/addon-fit.mjs:
  (**
   * Copyright (c) 2014-2024 The xterm.js authors. All rights reserved.
   * @license MIT
   *
   * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
   * @license MIT
   *
   * Originally forked from (with the author's permission):
   *   Fabrice Bellard's javascript vt100 for jslinux:
   *   http://bellard.org/jslinux/
   *   Copyright (c) 2011 Fabrice Bellard
   *)
*/
//# sourceMappingURL=client.js.map

    const plugin = module.exports;
    return { ...plugin, apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement('style');
        style.setAttribute('data-plugin', "@sporeking/dsh-ssh-research");
        style.textContent = "/* src/client/panel/panel.module.css */\n.panel_view {\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n}\n.panel_panel {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-width: 0;\n  min-height: 0;\n  padding: 14px 16px 16px;\n  gap: 10px;\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  font-family: var(--dsw-font-family);\n}\n.panel_panelHeader {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex: none;\n}\n.panel_panelTitle {\n  margin: 0;\n  flex: 1;\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--dsw-alias-label-primary);\n  white-space: nowrap;\n}\n.panel_backButton {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.panel_tabBar {\n  display: flex;\n  gap: 2px;\n  flex: none;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n.panel_tab {\n  padding: 7px 14px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  border: none;\n  border-bottom: 2px solid transparent;\n  border-radius: 6px 6px 0 0;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.panel_tab:hover {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.panel_tab[data-active] {\n  color: var(--dsw-alias-label-primary);\n  font-weight: 600;\n  border-bottom-color: var(--dsw-alias-state-business-primary);\n}\n.panel_panelContent {\n  flex: 1;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.panel_tabBody {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n}\n.panel_fillBody {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n.panel_toolbar {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: none;\n  flex-wrap: wrap;\n}\n.panel_controls {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: none;\n  flex-wrap: wrap;\n}\n.panel_controls .panel_input {\n  flex: 0 1 260px;\n  min-width: 150px;\n}\n.panel_toolbarSpacer {\n  flex: 1;\n}\n.panel_search {\n  flex: 0 1 260px;\n  min-width: 120px;\n  padding: 6px 10px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n}\n.panel_search::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n.panel_groupBySelect {\n  padding: 6px 8px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n}\n.panel_groupSection + .panel_groupSection {\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n.panel_groupHeader {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 4px 8px;\n  position: sticky;\n  top: 0;\n  background: var(--dsw-alias-bg-base, var(--dsw-specific-input-major));\n}\n.panel_groupToggle {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex: 1;\n  min-width: 0;\n  padding: 4px 6px;\n  border: none;\n  background: none;\n  color: var(--dsw-alias-label-primary);\n  font-size: 12.5px;\n  font-weight: 500;\n  cursor: pointer;\n  text-align: left;\n  border-radius: 6px;\n}\n.panel_groupToggle:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.panel_groupChevron {\n  width: 7px;\n  height: 7px;\n  border-right: 1.5px solid var(--dsw-alias-label-tertiary);\n  border-bottom: 1.5px solid var(--dsw-alias-label-tertiary);\n  transform: rotate(45deg);\n  transition: transform 120ms ease;\n  flex: none;\n  margin-bottom: 2px;\n}\n.panel_groupChevron[data-collapsed] {\n  transform: rotate(-45deg);\n  margin-bottom: 0;\n}\n.panel_groupName {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.panel_groupCount {\n  color: var(--dsw-alias-label-tertiary);\n  font-weight: 400;\n  flex: none;\n}\n.panel_tableWrap {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n}\n.panel_table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 12.5px;\n}\n.panel_table th {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  padding: 8px 10px;\n  text-align: left;\n  background: var(--dsw-alias-bg-layer-2);\n  color: var(--dsw-alias-label-secondary);\n  font-weight: 600;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n  white-space: nowrap;\n}\n.panel_table td {\n  padding: 7px 10px;\n  border-bottom: 1px solid var(--dsw-alias-separator-primary);\n  vertical-align: top;\n}\n.panel_table tbody tr:last-child td {\n  border-bottom: none;\n}\n.panel_table tbody tr:hover td {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.panel_mono {\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Consolas,\n    monospace;\n}\n.panel_cellMuted {\n  color: var(--dsw-alias-label-tertiary);\n}\n.panel_actions {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  white-space: nowrap;\n}\n.panel_inlineTest {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 11.5px;\n  color: var(--dsw-alias-label-secondary);\n}\n.panel_inlineTest[data-status=ok] {\n  color: var(--dsw-alias-state-success-primary);\n}\n.panel_inlineTest[data-status=fail] {\n  color: var(--dsw-alias-state-error-primary);\n}\n.panel_badge {\n  display: inline-block;\n  padding: 1px 8px;\n  font-size: 11px;\n  line-height: 1.6;\n  border-radius: 999px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-secondary);\n  white-space: nowrap;\n}\n.panel_badge[data-kind=key] {\n  color: var(--dsw-alias-state-business-primary);\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.panel_badge[data-kind=password] {\n  color: var(--dsw-alias-state-warn-primary);\n  border-color: var(--dsw-alias-state-warn-primary);\n}\n.panel_badge[data-kind=agent] {\n  color: var(--dsw-alias-state-success-primary);\n  border-color: var(--dsw-alias-state-success-primary);\n}\n.panel_badge[data-kind=proxy] {\n  margin-left: 6px;\n  color: var(--dsw-alias-state-business-primary);\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.panel_badge[data-kind=forward-agent] {\n  margin-left: 6px;\n  color: var(--dsw-alias-state-warn-primary);\n  border-color: var(--dsw-alias-state-warn-primary);\n}\n.panel_badge[data-status=ok] {\n  color: var(--dsw-alias-state-success-primary);\n  border-color: var(--dsw-alias-state-success-primary);\n}\n.panel_badge[data-status=fail] {\n  color: var(--dsw-alias-state-error-primary);\n  border-color: var(--dsw-alias-state-error-primary);\n}\n.panel_badge[data-status=timeout] {\n  color: var(--dsw-alias-state-warn-primary);\n  border-color: var(--dsw-alias-state-warn-primary);\n}\n.panel_primaryButton {\n  padding: 6px 14px;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary-foreground);\n  background: var(--dsw-alias-button-info-fill);\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.panel_primaryButton:hover:not(:disabled) {\n  background: var(--dsw-alias-button-info-hover);\n}\n.panel_primaryButton:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n.panel_ghostButton {\n  padding: 5px 12px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-primary);\n  background: transparent;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.panel_ghostButton:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.panel_ghostButton:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n.panel_iconButton {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n  padding: 0;\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  font-size: 13px;\n}\n.panel_iconButton:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.panel_linkButton {\n  padding: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-state-business-primary);\n  background: none;\n  border: none;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.panel_linkButton:hover:not(:disabled) {\n  text-decoration: underline;\n}\n.panel_linkButton:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n.panel_linkButton[data-danger] {\n  color: var(--dsw-alias-state-error-primary);\n}\n.panel_spinner {\n  display: inline-block;\n  width: 11px;\n  height: 11px;\n  flex: none;\n  border: 2px solid var(--dsw-alias-state-business-primary);\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: panel_dshSshSpin 800ms linear infinite;\n  vertical-align: -1px;\n}\n@keyframes panel_dshSshSpin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.panel_banner {\n  padding: 8px 12px;\n  font-size: 12.5px;\n  line-height: 1.5;\n  border-radius: 8px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-secondary);\n  overflow-wrap: anywhere;\n}\n.panel_importSkips {\n  list-style: none;\n  margin: 6px 0 0;\n  padding: 8px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n.panel_importSkipRow {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  gap: 12px;\n  font-size: 12px;\n}\n.panel_banner[data-kind=ok] {\n  color: var(--dsw-alias-state-success-primary);\n  border-color: var(--dsw-alias-state-success-primary);\n}\n.panel_banner[data-kind=error] {\n  color: var(--dsw-alias-state-error-primary);\n  border-color: var(--dsw-alias-state-error-primary);\n}\n.panel_banner[data-kind=info] {\n  color: var(--dsw-alias-state-business-primary);\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.panel_empty {\n  padding: 28px 12px;\n  text-align: center;\n  font-size: 12.5px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.panel_loading {\n  padding: 28px 12px;\n  text-align: center;\n  font-size: 12.5px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.panel_modalBackdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 40;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--dsw-alias-bg-mask-1);\n}\n.panel_modal {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: min(560px, calc(100vw - 48px));\n  max-height: calc(100vh - 96px);\n  overflow-y: auto;\n  padding: 18px;\n  background: var(--dsw-alias-bg-base);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 14px;\n  box-shadow: var(--dsw-shadow-lv3);\n  color: var(--dsw-alias-label-primary);\n}\n.panel_modalTitle {\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n}\n.panel_modalFooter {\n  display: flex;\n  justify-content: flex-end;\n  gap: 10px;\n  margin-top: 4px;\n}\n.panel_formError {\n  margin: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-state-error-primary);\n}\n.panel_hint {\n  font-size: 11.5px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.panel_field {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.panel_fieldLabel {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-secondary);\n}\n.panel_input {\n  padding: 7px 10px;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-specific-input-major);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  outline: none;\n  resize: vertical;\n  font-family: inherit;\n}\n.panel_input:focus {\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.panel_input::placeholder {\n  color: var(--dsw-alias-label-tertiary);\n}\n.panel_input:disabled {\n  opacity: 0.55;\n}\n.panel_formRow {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 10px 12px;\n}\n.panel_radioRow {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}\n.panel_radioLabel {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n}\n.panel_termBody {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n.panel_termTabs {\n  display: flex;\n  align-items: stretch;\n  gap: 2px;\n  flex: none;\n  overflow-x: auto;\n  scrollbar-width: thin;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n.panel_termTab {\n  display: inline-flex;\n  align-items: center;\n  flex: none;\n  max-width: 200px;\n  border-radius: 6px 6px 0 0;\n  border-bottom: 2px solid transparent;\n}\n.panel_termTab[data-active] {\n  background: var(--dsw-alias-bg-layer-2);\n  border-bottom-color: var(--dsw-alias-state-business-primary);\n}\n.panel_termTabLabel {\n  display: inline-flex;\n  align-items: baseline;\n  gap: 6px;\n  min-width: 0;\n  padding: 5px 4px 5px 10px;\n  font-size: 12.5px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  border: none;\n  cursor: pointer;\n}\n.panel_termTab[data-active] .panel_termTabLabel {\n  color: var(--dsw-alias-label-primary);\n  font-weight: 600;\n}\n.panel_termTabAlias {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.panel_termTabState {\n  flex: none;\n  font-size: 11px;\n  font-weight: 400;\n  color: var(--dsw-alias-label-tertiary);\n}\n.panel_termTabState[data-state=error] {\n  color: var(--dsw-alias-state-error-primary);\n}\n.panel_termTabState[data-state=exited] {\n  color: var(--dsw-alias-label-secondary);\n}\n.panel_termTabClose,\n.panel_termTabNew {\n  flex: none;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  margin-right: 4px;\n  padding: 0;\n  font-size: 13px;\n  line-height: 1;\n  color: var(--dsw-alias-label-tertiary);\n  background: transparent;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n}\n.panel_termTabNew {\n  width: 24px;\n  margin: 2px 0 2px 4px;\n  font-size: 15px;\n}\n.panel_termTabClose:hover,\n.panel_termTabNew:hover:not(:disabled) {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.panel_termTabNew:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n.panel_termWrap {\n  position: relative;\n  flex: 1;\n  min-height: 0;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n  overflow: hidden;\n  background: #0b0e14;\n}\n.panel_termContainer {\n  position: absolute;\n  inset: 8px 10px;\n}\n.panel_termPlaceholder {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 24px;\n  text-align: center;\n  font-size: 12.5px;\n  color: var(--dsw-alias-label-tertiary);\n  background: var(--dsw-alias-bg-base);\n}\n.panel_hiddenFile {\n  display: none;\n}\n.panel_browsePanel {\n  display: flex;\n  flex-direction: column;\n  flex: none;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n  overflow: hidden;\n}\n.panel_browseHeader {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  background: var(--dsw-alias-bg-layer-2);\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n.panel_browsePath {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Consolas,\n    monospace;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n}\n.panel_browseList {\n  max-height: 240px;\n  overflow-y: auto;\n}\n.panel_dirRow {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  gap: 12px;\n  width: 100%;\n  padding: 5px 10px;\n  text-align: left;\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--dsw-alias-label-primary);\n  background: transparent;\n  border: none;\n  border-bottom: 1px solid var(--dsw-alias-separator-primary);\n  cursor: pointer;\n}\n.panel_dirRow:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.panel_dirRow[data-type=dir] .panel_dirName {\n  color: var(--dsw-alias-state-business-primary);\n}\n.panel_dirRow[data-up] {\n  color: var(--dsw-alias-label-secondary);\n}\n.panel_dirName {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Consolas,\n    monospace;\n}\n.panel_dirType {\n  color: var(--dsw-alias-label-tertiary);\n  white-space: nowrap;\n}\n.panel_dirSize {\n  color: var(--dsw-alias-label-tertiary);\n  white-space: nowrap;\n  text-align: right;\n}\n.panel_transferBlock {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  flex: none;\n}\n.panel_progressMeta {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n}\n.panel_progressTrack {\n  height: 8px;\n  border-radius: 999px;\n  background: var(--dsw-alias-interactive-bg-hover);\n  overflow: hidden;\n}\n.panel_progressBar {\n  height: 100%;\n  border-radius: 999px;\n  background: var(--dsw-alias-state-business-primary);\n  transition: width 120ms linear;\n}\n.panel_previewPanel {\n  display: flex;\n  flex-direction: column;\n  flex: none;\n  min-width: 0;\n  gap: 8px;\n  padding: 10px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n}\n.panel_previewHeader {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n}\n.panel_previewTitle {\n  flex: 1 1 180px;\n  min-width: 0;\n  overflow-wrap: anywhere;\n  font-size: 13px;\n}\n.panel_previewText {\n  margin: 0;\n  padding: 10px;\n  max-height: 420px;\n  overflow: auto;\n  white-space: pre;\n  font:\n    12px/1.5 ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Consolas,\n    monospace;\n  background: var(--dsw-alias-bg-layer-2);\n  border-radius: 6px;\n}\n.panel_previewImage {\n  display: block;\n  max-width: 100%;\n  max-height: 480px;\n  object-fit: contain;\n  align-self: flex-start;\n}\n.panel_previewTableWrap {\n  max-height: 420px;\n  overflow: auto;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 6px;\n}\n.panel_previewTable td {\n  white-space: pre-wrap;\n  min-width: 80px;\n  max-width: 480px;\n  overflow-wrap: anywhere;\n  border-right: 1px solid var(--dsw-alias-border-l1);\n}\n.panel_tunnelList {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: none;\n}\n.panel_tunnelRow {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 12px;\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n}\n.panel_tunnelRow[data-state=forwarding] {\n  border-color: var(--dsw-alias-state-success-primary);\n}\n.panel_tunnelRow[data-state=connecting] {\n  border-color: var(--dsw-alias-state-warn-primary);\n}\n.panel_tunnelRow[data-state=failed] {\n  border-color: var(--dsw-alias-state-error-primary);\n}\n.panel_tunnelLabel {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Consolas,\n    monospace;\n  font-size: 12.5px;\n}\n.panel_formCard {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 12px;\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n  flex: none;\n}\n.panel_clusterForm {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: none;\n}\n.panel_clusterFilters {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 10px;\n}\n.panel_commandInput {\n  min-height: 96px;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Consolas,\n    monospace;\n}\n.panel_cellDetails summary {\n  cursor: pointer;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n}\n.panel_cellPre {\n  margin: 4px 0 0;\n  padding: 6px 8px;\n  max-height: 180px;\n  overflow: auto;\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 6px;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Consolas,\n    monospace;\n  font-size: 11.5px;\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n/*# sourceMappingURL=client.css.map */\n";
        document.head.append(style);
        return () => style.remove();
      }, 'ssh-research: styles');
      return plugin.apply(ctx);
    } };
  }
});
