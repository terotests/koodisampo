class RangerProcessBase  {
  constructor() {
    this.__rangerId = 0;
    this.__rangerParentId = 0;
    this.__rangerTypeId = 0;
    this.__rangerClassName = "";
    this.__rangerPath = "";
    this.__rangerStateGeneration = 0;
    this.__rangerChildren = [];
  }
  bumpStateGeneration () {
    this.__rangerStateGeneration = this.__rangerStateGeneration + 1;
  };
  markStateDirty () {
    this.__rangerStateGeneration = this.__rangerStateGeneration + 1;
    this.flushUiNotify();
  };
  flushUiNotify () {
    const uiHost = ProcessUiHost.__singleton();
    if ( uiHost.isUiNotifySuppressed() ) {
      return;
    }
    uiHost.notifyPathDeliveredCount = uiHost.notifyPathDeliveredCount + 1;
    if ( (this.__rangerPath.length) > 0 ) {
      uiHost.notifyPath(this.__rangerPath);
    }
    if ( this.__rangerId != 0 ) {
      uiHost.notifyId(this.__rangerId);
    }
  };
  __rangerOnDescendantUiChanged (child, hint) {
    this.markStateDirty();
    const parent = this.__rangerParent;
    if ( (typeof(parent) === "undefined") == false ) {
      const p = parent;
      if ( p.__rangerId != 0 ) {
        p.__rangerOnDescendantUiChanged(child, hint);
      }
    }
  };
  __rangerTrackChild (child) {
    this.__rangerChildren.push(child);
  };
  __rangerClearChildren () {
    let empty = [];
    this.__rangerChildren = empty;
  };
  __rangerFindRoot () {
    let cur = this;
    let parent = cur.__rangerParent;
    while ((typeof(parent) === "undefined") == false) {
      cur = parent;
      parent = cur.__rangerParent;
    };
    return cur;
  };
  __rangerSyncChildren () {
  };
  __rangerInvokeStart () {
  };
  __rangerInvokeStop () {
  };
  __rangerInvokeHibernate () {
    return "";
  };
  __rangerInvokeWakeup (state) {
  };
  __rangerStopSubtree () {
  };
  receiveMessage (name, value) {
  };
}
class ProcessIdRegistry  {
  constructor() {
    if (ProcessIdRegistry.__singleton_instance != null) {
      return ProcessIdRegistry.__singleton_instance;
    }
    this.next = 1;
    ProcessIdRegistry.__singleton_instance = this;
  }
  allocate () {
    const id = this.next;
    this.next = id + 1;
    return id;
  };
}
ProcessIdRegistry.__singleton_instance = null;
ProcessIdRegistry.__singleton = function() {
  if (ProcessIdRegistry.__singleton_instance == null) {
    ProcessIdRegistry.__singleton_instance = new ProcessIdRegistry();
  }
  return ProcessIdRegistry.__singleton_instance;
};
class ProcessNameRegistry  {
  constructor() {
    if (ProcessNameRegistry.__singleton_instance != null) {
      return ProcessNameRegistry.__singleton_instance;
    }
    this.byPath = {};
    ProcessNameRegistry.__singleton_instance = this;
  }
  register (path, proc) {
    if ( (path.length) == 0 ) {
      return;
    }
    if ( proc.__rangerId == 0 ) {
      return;
    }
    const existing = ( this.byPath.hasOwnProperty(path) ? this.byPath[path] : undefined );
    if ( (typeof(existing) === "undefined") == false ) {
      const old = existing;
      if ( (old.__rangerId != 0) && (old.__rangerId != proc.__rangerId) ) {
        console.log("ERROR: duplicate live @name process path: " + path);
        return;
      }
    }
    this.byPath[path] = proc;
  };
  unregister (path) {
  };
  findByPath (path) {
    return ( this.byPath.hasOwnProperty(path) ? this.byPath[path] : undefined );
  };
  hasLive (path) {
    const found = ( this.byPath.hasOwnProperty(path) ? this.byPath[path] : undefined );
    if ( typeof(found) === "undefined" ) {
      return false;
    }
    const inst = found;
    if ( inst.__rangerId == 0 ) {
      return false;
    }
    return true;
  };
  unbindIfConfigured (proc) {
    if ( (proc.__rangerPath.length) > 0 ) {
      this.unregister(proc.__rangerPath);
      proc.__rangerPath = "";
    }
  };
  bindIfConfigured (proc) {
    if ( proc.__rangerId == 0 ) {
      return;
    }
    if ( proc.__rangerTypeId == 1 ) {
      proc.__rangerPath = "app.koodisampo";
      this.register("app.koodisampo", proc);
      return;
    }
    if ( proc.__rangerTypeId == 2 ) {
      proc.__rangerPath = "app.koodisampo.root";
      this.register("app.koodisampo.root", proc);
      return;
    }
  };
  findProcess (path) {
    if ( this.hasLive(path) ) {
      return this.findByPath(path);
    }
    return ( this.byPath.hasOwnProperty("__rgr_no_such_process__") ? this.byPath["__rgr_no_such_process__"] : undefined );
  };
}
ProcessNameRegistry.__singleton_instance = null;
ProcessNameRegistry.__singleton = function() {
  if (ProcessNameRegistry.__singleton_instance == null) {
    ProcessNameRegistry.__singleton_instance = new ProcessNameRegistry();
  }
  return ProcessNameRegistry.__singleton_instance;
};
class ProcessUiHost  {
  constructor() {
    if (ProcessUiHost.__singleton_instance != null) {
      return ProcessUiHost.__singleton_instance;
    }
    this.__uiNotifySuppressDepth = 0;
    this.notifyPathDeliveredCount = 0;
    ProcessUiHost.__singleton_instance = this;
  }
  isUiNotifySuppressed () {
    return this.__uiNotifySuppressDepth > 0;
  };
  resetNotifyDeliveryCount () {
    this.notifyPathDeliveredCount = 0;
  };
  beginSuppressUiNotify () {
    this.__uiNotifySuppressDepth = this.__uiNotifySuppressDepth + 1;
  };
  endSuppressUiNotify () {
    if ( this.__uiNotifySuppressDepth > 0 ) {
      this.__uiNotifySuppressDepth = this.__uiNotifySuppressDepth - 1;
    }
  };
  notifyPath (path) {
  };
  notifyId (processId) {
  };
}
ProcessUiHost.__singleton_instance = null;
ProcessUiHost.__singleton = function() {
  if (ProcessUiHost.__singleton_instance == null) {
    ProcessUiHost.__singleton_instance = new ProcessUiHost();
  }
  return ProcessUiHost.__singleton_instance;
};
class ProcessRuntime  {
  constructor() {
    if (ProcessRuntime.__singleton_instance != null) {
      return ProcessRuntime.__singleton_instance;
    }
    this.__dispatchTurnDepth = 0;
    ProcessRuntime.__singleton_instance = this;
  }
}
ProcessRuntime.__singleton_instance = null;
ProcessRuntime.__singleton = function() {
  if (ProcessRuntime.__singleton_instance == null) {
    ProcessRuntime.__singleton_instance = new ProcessRuntime();
  }
  return ProcessRuntime.__singleton_instance;
};
ProcessRuntime.beginDispatchTurn = function(root) {
  const rt = ProcessRuntime.__singleton();
  if ( rt.__dispatchTurnDepth == 0 ) {
    const uiHost = ProcessUiHost.__singleton();
    uiHost.beginSuppressUiNotify();
  }
  rt.__dispatchTurnDepth = rt.__dispatchTurnDepth + 1;
};
ProcessRuntime.endDispatchTurn = function(root) {
  const rt = ProcessRuntime.__singleton();
  if ( rt.__dispatchTurnDepth == 0 ) {
    return;
  }
  rt.__dispatchTurnDepth = rt.__dispatchTurnDepth - 1;
  if ( rt.__dispatchTurnDepth > 0 ) {
    return;
  }
  root.__rangerSyncChildren();
  const uiHost = ProcessUiHost.__singleton();
  uiHost.endSuppressUiNotify();
  root.flushUiNotify();
};
ProcessRuntime.stopInstance = function(proc) {
  (ProcessNameRegistry.__singleton()).unbindIfConfigured(proc);
  proc.__rangerStopSubtree();
};
ProcessRuntime.startInstance = function(proc) {
  (ProcessNameRegistry.__singleton()).bindIfConfigured(proc);
  proc.__rangerInvokeStart();
};
ProcessRuntime.hibernateInstance = function(proc) {
  const res = proc.__rangerInvokeHibernate();
  return res;
};
ProcessRuntime.wakeupInstance = function(proc, state) {
  proc.__rangerInvokeWakeup(state);
};
ProcessRuntime.collectAllLiveRoots = function() {
  let roots = [];
  const __rgr_GameSession_all = GameSession.allInstances();
  for ( let i = 0; i < __rgr_GameSession_all.length; i++) {
    var __rgrRoot = __rgr_GameSession_all[i];
    if ( (__rgrRoot.__rangerId != 0) && (__rgrRoot.__rangerParentId == 0) ) {
      roots.push(__rgrRoot);
    }
  };
  const __rgr_KoodisampoAppRoot_all = KoodisampoAppRoot.allInstances();
  for ( let i_1 = 0; i_1 < __rgr_KoodisampoAppRoot_all.length; i_1++) {
    var __rgrRoot_1 = __rgr_KoodisampoAppRoot_all[i_1];
    if ( (__rgrRoot_1.__rangerId != 0) && (__rgrRoot_1.__rangerParentId == 0) ) {
      roots.push(__rgrRoot_1);
    }
  };
  return roots;
};
ProcessRuntime.printProcessTree = function() {
  const __rgrTreeView = new ProcessTreeView();
  const __rgrRoots = ProcessRuntime.collectAllLiveRoots();
  const __rgrTitle = "";
  __rgrTreeView.renderRoots(__rgrRoots, __rgrTitle);
};
ProcessRuntime.printProcessTreeTitled = function(title) {
  const __rgrTreeView = new ProcessTreeView();
  const __rgrRoots = ProcessRuntime.collectAllLiveRoots();
  __rgrTreeView.renderRoots(__rgrRoots, title);
};
ProcessRuntime.stopByProcessId = function(processId) {
  if ( GameSession.tryStopByProcessId(processId) ) {
    return;
  }
  if ( KoodisampoAppRoot.tryStopByProcessId(processId) ) {
    return;
  }
};
ProcessRuntime.stopByClassName = function(name) {
  if ( name == "GameSession" ) {
    GameSession.stopAllLive();
    return;
  }
  if ( name == "KoodisampoAppRoot" ) {
    KoodisampoAppRoot.stopAllLive();
    return;
  }
};
class RangerFieldDescriptor  {
  constructor() {
    this.name = "";     /** note: unused */
    this.typeName = "";     /** note: unused */
    this.isOptional = false;     /** note: unused */
  }
}
class RangerClassDescriptor  {
  constructor() {
    this.className = "";     /** note: unused */
    this.fields = [];     /** note: unused */
  }
}
class ProcessTreeView  {
  constructor() {
    this.showParentId = true;
  }
  isLive (proc) {
    if ( proc.__rangerId == 0 ) {
      return false;
    }
    return true;
  };
  nodeLabel (proc) {
    let label = "";
    label = proc.__rangerClassName;
    label = label + " #";
    label = label + ((proc.__rangerId.toString()));
    if ( this.showParentId ) {
      label = label + " parent=";
      label = label + ((proc.__rangerParentId.toString()));
    }
    return label;
  };
  countLiveChildren (proc) {
    let n = 0;
    for ( let i = 0; i < proc.__rangerChildren.length; i++) {
      var ch = proc.__rangerChildren[i];
      if ( this.isLive(ch) ) {
        n = n + 1;
      }
    };
    return n;
  };
  renderSubtree (proc, indent) {
    let liveIdx = 0;
    const total = this.countLiveChildren(proc);
    for ( let i = 0; i < proc.__rangerChildren.length; i++) {
      var ch = proc.__rangerChildren[i];
      if ( this.isLive(ch) == false ) {
        continue;
      }
      let branch = "|-> ";
      const childIndent = "    ";
      if ( liveIdx == (total - 1) ) {
        branch = "L-> ";
      }
      let line = "";
      line = indent + branch;
      const nodeText = this.nodeLabel(ch);
      line = line + nodeText;
      console.log(line);
      let nextIndent = "";
      nextIndent = indent + childIndent;
      this.renderSubtree(ch, nextIndent);
      liveIdx = liveIdx + 1;
    };
  };
  countLiveRoots (roots) {
    let c = 0;
    for ( let i = 0; i < roots.length; i++) {
      var r = roots[i];
      if ( this.isLive(r) ) {
        c = c + 1;
      }
    };
    return c;
  };
  renderRoots (roots, title) {
    console.log("");
    if ( title != "" ) {
      console.log(title);
    } else {
      console.log("Process tree");
    }
    const n = roots.length;
    if ( n == 0 ) {
      console.log("  (no live root processes)");
      return;
    }
    const liveTotal = this.countLiveRoots(roots);
    if ( liveTotal == 0 ) {
      console.log("  (no live root processes)");
      return;
    }
    let shown = 0;
    let i = 0;
    while (i < n) {
      const root = roots[i];
      if ( this.isLive(root) ) {
        let branch = "|-> ";
        const childIndent = "    ";
        if ( shown == (liveTotal - 1) ) {
          branch = "L-> ";
        }
        let line = "";
        line = "  " + branch;
        const rootText = this.nodeLabel(root);
        line = line + rootText;
        console.log(line);
        this.renderSubtree(root, childIndent);
        shown = shown + 1;
      }
      i = i + 1;
    };
  };
}
class FeatureKarma  {
  constructor() {
    this.ids = [];
    this.amounts = [];
  }
  total () {
    let sum = 0;
    let i = 0;
    while (i < (this.amounts.length)) {
      sum = sum + (this.amounts[i]);
      i = i + 1;
    };
    return sum;
  };
  get (featureId) {
    let i = 0;
    while (i < (this.ids.length)) {
      if ( (this.ids[i]) == featureId ) {
        return this.amounts[i];
      }
      i = i + 1;
    };
    return 0;
  };
  add (featureId, karma) {
    if ( karma <= 0 ) {
      return;
    }
    let i = 0;
    while (i < (this.ids.length)) {
      if ( (this.ids[i]) == featureId ) {
        const cur = this.amounts[i];
        this.amounts[i] = cur + karma;
        return;
      }
      i = i + 1;
    };
    this.ids.push(featureId);
    this.amounts.push(karma);
  };
  grantList (featureIds, defaultKarma) {
    let i = 0;
    while (i < (featureIds.length)) {
      this.add(featureIds[i], defaultKarma);
      i = i + 1;
    };
  };
  loseKarma (penalty) {
    if ( penalty <= 0 ) {
      return;
    }
    let left = penalty;
    let i = this.amounts.length;
    i = i - 1;
    while (i >= 0) {
      if ( left <= 0 ) {
        return;
      }
      const cur = this.amounts[i];
      if ( cur > 0 ) {
        let take = left;
        if ( take > cur ) {
          take = cur;
        }
        this.amounts[i] = cur - take;
        left = left - take;
      }
      i = i - 1;
    };
  };
}
class StorySummary  {
  constructor() {
    this.id = "";
    this.title = "";
    this.description = "";
    this.filename = "";
    this.estimatedMinutes = 0;
    this.sortOrder = 0;
  }
}
class StoryView  {
  constructor() {
    this.screen = "idle";
    this.storyTitle = "";
    this.nodeTitle = "";
    this.bodyText = "";
    this.nodeKind = "";
    this.promptLine = "";
    this.choiceIds = [];
    this.choiceTexts = [];
    this.codeTemplate = "";
    this.codeHint = "";
    this.feedbackMessage = "";
    this.feedbackCorrect = false;
    this.pointsEarned = 0;
    this.totalPoints = 0;
    this.totalKarma = 0;
    this.featureGainIds = [];
    this.featureGainKarma = [];
    this.outcome = "";
    this.deaths = 0;
  }
}
class StoryCatalog  {
  constructor() {
  }
  pushStory (items, id, title, description, filename, minutes, order) {
    const s = new StorySummary();
    s.id = id;
    s.title = title;
    s.description = description;
    s.filename = filename;
    s.estimatedMinutes = minutes;
    s.sortOrder = order;
    items.push(s);
  };
  list () {
    let items = [];
    this.pushStory(items, "modern-cpp-intro", "Legacy herää — modernin C++:n polku", "auto, nullptr, range-for", "modern-cpp-intro.json", 8, 1);
    this.pushStory(items, "courtyard-dog", "Toimistokoira", "Pihamaan tervehdys", "courtyard-dog.json", 1, 0);
    this.pushStory(items, "courtyard-janitor", "Talkkari ja vaja", "Avain ja kadonnut kortti", "courtyard-janitor.json", 2, 0);
    this.pushStory(items, "lobby-interview", "Työhaastattelu", "Kulkulupa aulassa", "lobby-interview.json", 3, 0);
    this.pushStory(items, "cpp-safety-const", "Const-correctness — code review", "const &, pass-by-value, const-metodit", "cpp-safety-const.json", 12, 2);
    this.pushStory(items, "cpp-safety-memory", "Muistivuodot standupissa", "unique_ptr, shared_ptr, vector", "cpp-safety-memory.json", 15, 3);
    this.pushStory(items, "cpp-safety-casts-exceptions", "Poikkeukset ja castit", "static_cast, poikkeukset", "cpp-safety-casts-exceptions.json", 14, 4);
    this.pushStory(items, "cpp-safety-variadic", "Vaihtelevat argumentit", "variadic templates, std::format", "cpp-safety-variadic.json", 12, 5);
    this.pushStory(items, "vainamoinen-challenge", "CTO:n koodikatselmus", "Finaali — yhdistä oppimasi", "vainamoinen-challenge.json", 20, 6);
    return items;
  };
  findByIndex (index) {
    const items = this.list();
    if ( index < 0 ) {
      return new StorySummary();
    }
    if ( index >= (items.length) ) {
      return new StorySummary();
    }
    return items[index];
  };
  findById (id) {
    const items = this.list();
    let i = 0;
    const n = items.length;
    while (i < n) {
      const s = items[i];
      if ( s.id == id ) {
        return s;
      }
      i = i + 1;
    };
    return new StorySummary();
  };
}
class StoryJson  {
  constructor() {
  }
  objFieldStr (obj, key) {
    const v = (typeof (obj [key]) != "string" ) ? undefined : obj [key] 
    ;
    if ( typeof(v) === "undefined" ) {
      return "";
    }
    return v;
  };
  objFieldInt (obj, key) {
    const v = isNaN( parseInt(obj [key]) ) ? undefined : parseInt(obj [key]) 
    ;
    if ( typeof(v) === "undefined" ) {
      return 0;
    }
    return v;
  };
  objFieldBool (obj, key) {
    const v = typeof(obj [key]) === "undefined" ? undefined :(obj [key]) ;
    if ( typeof(v) === "undefined" ) {
      return false;
    }
    return v;
  };
  arrayObjectAt (arr, index) {
    const raw = arr[index];
    const obj = raw;
    return obj;
  };
  collectFeatureIds (features) {
    let ids = [];
    let i = 0;
    const n = features.length;
    while (i < n) {
      const feat = this.arrayObjectAt(features, i);
      const fid = this.objFieldStr(feat, "id");
      if ( (fid.length) > 0 ) {
        ids.push(fid);
      }
      i = i + 1;
    };
    return ids;
  };
}
class StoryEngine  {
  constructor() {
    this.storyId = "";
    this.storyTitle = "";
    this.currentNodeId = "";
    this.phase = "idle";
    this.totalPoints = 0;
    this.deaths = 0;
    this.pendingNext = "";
    this.pendingFeedback = "";
    this.pendingCorrect = false;
    this.pendingPoints = 0;
    this.pendingFeatureIds = [];
    this.hasStory = false;
    this.shuffledForNode = "";
    this.choiceOrder = [];
    this.json = new StoryJson();
    let empty = [];
    this.pendingFeatureIds = empty;
  }
  resetChoiceShuffle () {
    this.shuffledForNode = "";
    let empty = [];
    this.choiceOrder = empty;
  };
  ensureChoiceShuffle (node) {
    const choicesOpt = (node["choices"] instanceof Array ) ? node ["choices"] : undefined ;
    if ( typeof(choicesOpt) === "undefined" ) {
      return;
    }
    const n = (choicesOpt).length;
    if ( this.shuffledForNode == this.currentNodeId ) {
      if ( (this.choiceOrder.length) == n ) {
        return;
      }
    }
    this.shuffledForNode = this.currentNodeId;
    let order = [];
    let i = 0;
    while (i < n) {
      order.push(i);
      i = i + 1;
    };
    if ( n > 1 ) {
      i = n - 1;
      while (i > 0) {
        const j = Math.floor(Math.random()*(i - 0 + 1) + 0);
        const tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
        i = i - 1;
      };
    }
    this.choiceOrder = order;
  };
  clearPending () {
    this.pendingNext = "";
    this.pendingFeedback = "";
    this.pendingCorrect = false;
    this.pendingPoints = 0;
    let empty = [];
    this.pendingFeatureIds = empty;
  };
  loadFromText (storyJson) {
    this.clearPending();
    this.resetChoiceShuffle();
    try {
      const rootOpt = JSON.parse(storyJson);
      if ( typeof(rootOpt) === "undefined" ) {
        this.hasStory = false;
        return false;
      }
      this.root = rootOpt;
    } catch(e) {
      this.hasStory = false;
      return false;
    }
    this.storyId = this.json.objFieldStr((this.root), "id");
    this.storyTitle = this.json.objFieldStr((this.root), "title");
    const nodesOpt = ((this.root)["nodes"] instanceof Object ) ? (this.root) ["nodes"] : undefined ;
    if ( typeof(nodesOpt) === "undefined" ) {
      this.hasStory = false;
      return false;
    }
    this.nodes = nodesOpt;
    this.hasStory = true;
    if ( (this.storyId.length) == 0 ) {
      this.hasStory = false;
      return false;
    }
    const start = this.json.objFieldStr((this.root), "startNode");
    this.phase = "playing";
    this.totalPoints = 0;
    this.currentNodeId = start;
    return true;
  };
  currentNode () {
    const nodeOpt = ((this.nodes)[this.currentNodeId] instanceof Object ) ? (this.nodes) [this.currentNodeId] : undefined ;
    if ( typeof(nodeOpt) === "undefined" ) {
      return this.nodes;
    }
    return nodeOpt;
  };
  goToNode (nodeId, pointsEarned) {
    this.totalPoints = this.totalPoints + pointsEarned;
    this.currentNodeId = nodeId;
    if ( nodeId != this.shuffledForNode ) {
      let empty = [];
      this.choiceOrder = empty;
    }
    const node = this.currentNode();
    const kind = this.json.objFieldStr(node, "type");
    if ( kind == "end" ) {
      this.phase = "ended";
      const outcome = this.json.objFieldStr(node, "outcome");
      if ( outcome == "death" ) {
        this.deaths = this.deaths + 1;
      }
    } else {
      this.phase = "playing";
    }
  };
  fillBaseView (view) {
    view.screen = this.phase;
    view.storyTitle = this.storyTitle;
    view.totalPoints = this.totalPoints;
    view.totalKarma = this.karma.total();
    view.deaths = this.deaths;
    const node = this.currentNode();
    view.nodeTitle = this.json.objFieldStr(node, "title");
    view.bodyText = this.json.objFieldStr(node, "text");
    view.nodeKind = this.json.objFieldStr(node, "type");
  };
  fillChoices (view, node) {
    this.ensureChoiceShuffle(node);
    const choicesOpt = (node["choices"] instanceof Array ) ? node ["choices"] : undefined ;
    if ( typeof(choicesOpt) === "undefined" ) {
      return;
    }
    const choices = choicesOpt;
    let i = 0;
    const n = choices.length;
    let emptyIds = [];
    let emptyTexts = [];
    view.choiceIds = emptyIds;
    view.choiceTexts = emptyTexts;
    while (i < n) {
      const orig = this.choiceOrder[i];
      const choice = this.json.arrayObjectAt(choices, orig);
      view.choiceIds.push(this.json.objFieldStr(choice, "id"));
      view.choiceTexts.push(this.json.objFieldStr(choice, "text"));
      i = i + 1;
    };
  };
  menuView () {
    const view = new StoryView();
    view.screen = "menu";
    view.promptLine = "Valitse oppitunti numerolla tai q lopettaaksesi.";
    view.totalKarma = this.karma.total();
    view.deaths = this.deaths;
    return view;
  };
  getView () {
    const view = new StoryView();
    if ( this.phase == "idle" ) {
      return this.menuView();
    }
    if ( this.hasStory == false ) {
      view.screen = "idle";
      view.promptLine = "Ei ladattua tarinaa.";
      return view;
    }
    if ( this.phase == "feedback" ) {
      view.screen = "feedback";
      view.storyTitle = this.storyTitle;
      view.feedbackMessage = this.pendingFeedback;
      view.feedbackCorrect = this.pendingCorrect;
      view.pointsEarned = this.pendingPoints;
      view.totalPoints = this.totalPoints;
      view.totalKarma = this.karma.total();
      view.featureGainIds = this.pendingFeatureIds;
      let emptyKarma = [];
      view.featureGainKarma = emptyKarma;
      let i = 0;
      while (i < (this.pendingFeatureIds.length)) {
        view.featureGainKarma.push((this.karma).get((this.pendingFeatureIds[i])));
        i = i + 1;
      };
      view.promptLine = "Paina Enter jatkaaksesi...";
      return view;
    }
    if ( this.phase == "ended" ) {
      view.screen = "ended";
      this.fillBaseView(view);
      view.outcome = this.json.objFieldStr(this.currentNode(), "outcome");
      view.promptLine = "Paina Enter palataksesi valikkoon.";
      return view;
    }
    this.fillBaseView(view);
    view.screen = "playing";
    const node = this.currentNode();
    const kind = view.nodeKind;
    if ( kind == "narrative" ) {
      view.promptLine = "Paina Enter jatkaaksesi...";
    }
    if ( kind == "choice" ) {
      view.promptLine = "Valitse vastaus numerolla.";
      this.fillChoices(view, node);
    }
    if ( kind == "code" ) {
      view.codeTemplate = this.json.objFieldStr(node, "template");
      view.codeHint = this.json.objFieldStr(node, "hint");
      view.promptLine = "Kirjoita vastaus ja paina Enter.";
    }
    return view;
  };
  advanceNarrative () {
    if ( this.phase != "playing" ) {
      return;
    }
    const node = this.currentNode();
    if ( this.json.objFieldStr(node, "type") != "narrative" ) {
      return;
    }
    const nextId = this.json.objFieldStr(node, "next");
    this.goToNode(nextId, 0);
  };
  submitChoice (choiceIndex) {
    if ( this.phase != "playing" ) {
      return;
    }
    const node = this.currentNode();
    if ( this.json.objFieldStr(node, "type") != "choice" ) {
      return;
    }
    this.ensureChoiceShuffle(node);
    const choicesOpt = (node["choices"] instanceof Array ) ? node ["choices"] : undefined ;
    if ( typeof(choicesOpt) === "undefined" ) {
      return;
    }
    const choices = choicesOpt;
    if ( choiceIndex < 0 ) {
      return;
    }
    if ( choiceIndex >= (choices.length) ) {
      return;
    }
    const orig = this.choiceOrder[choiceIndex];
    const choice = this.json.arrayObjectAt(choices, orig);
    const correct = this.json.objFieldBool(choice, "correct");
    let points = 0;
    if ( correct ) {
      points = this.json.objFieldInt(choice, "points");
      if ( points <= 0 ) {
        points = 10;
      }
    }
    this.pendingNext = this.json.objFieldStr(choice, "next");
    this.pendingFeedback = this.json.objFieldStr(choice, "feedback");
    this.pendingCorrect = correct;
    this.pendingPoints = points;
    let empty = [];
    this.pendingFeatureIds = empty;
    if ( correct ) {
      const featuresOpt = (choice["features"] instanceof Array ) ? choice ["features"] : undefined ;
      if ( (typeof(featuresOpt) !== "undefined" && featuresOpt != null )  ) {
        const features = featuresOpt;
        this.pendingFeatureIds = this.json.collectFeatureIds(features);
        this.karma.grantList(this.pendingFeatureIds, 3);
      }
    }
    this.phase = "feedback";
  };
  dismissFeedback () {
    if ( this.phase != "feedback" ) {
      return;
    }
    this.goToNode(this.pendingNext, this.pendingPoints);
    this.clearPending();
  };
  applyCodeResult (answer, matches) {
    if ( this.phase != "playing" ) {
      return;
    }
    const node = this.currentNode();
    if ( this.json.objFieldStr(node, "type") != "code" ) {
      return;
    }
    const trimmed = answer;
    let minLen = this.json.objFieldInt(node, "minLength");
    if ( minLen <= 0 ) {
      minLen = 1;
    }
    let maxLen = this.json.objFieldInt(node, "maxLength");
    if ( maxLen <= 0 ) {
      maxLen = 200;
    }
    if ( (trimmed.length) < minLen ) {
      return;
    }
    if ( (trimmed.length) > maxLen ) {
      return;
    }
    let points = 0;
    if ( matches ) {
      points = 20;
    }
    let empty = [];
    this.pendingFeatureIds = empty;
    if ( matches ) {
      this.pendingNext = this.json.objFieldStr(node, "next");
      this.pendingFeedback = this.json.objFieldStr(node, "feedbackCorrect");
      const featuresOpt = (node["features"] instanceof Array ) ? node ["features"] : undefined ;
      if ( (typeof(featuresOpt) !== "undefined" && featuresOpt != null )  ) {
        const features = featuresOpt;
        this.pendingFeatureIds = this.json.collectFeatureIds(features);
        this.karma.grantList(this.pendingFeatureIds, 5);
      }
    } else {
      const wrongNext = this.json.objFieldStr(node, "wrongNext");
      if ( (wrongNext.length) > 0 ) {
        this.pendingNext = wrongNext;
      } else {
        this.pendingNext = this.json.objFieldStr(node, "next");
      }
      this.pendingFeedback = this.json.objFieldStr(node, "feedbackWrong");
    }
    this.pendingCorrect = matches;
    this.pendingPoints = points;
    this.phase = "feedback";
  };
  returnToMenu () {
    this.phase = "idle";
    this.hasStory = false;
    this.storyId = "";
    this.storyTitle = "";
    this.currentNodeId = "";
    this.clearPending();
    this.resetChoiceShuffle();
  };
}
StoryEngine.withKarma = function(karmaRef) {
  const engine = new StoryEngine();
  engine.karma = karmaRef;
  return engine;
};
class MapEntity  {
  constructor() {
    this.id = "";
    this.char = "?";
    this.x = 0;
    this.y = 0;
    this.storyId = "";
    this.name = "";
    this.kind = "";
    this.itemTool = "";
    this.itemOwner = "";
    this.sociability = 50;
    this.persistence = 50;
    this.moveMode = "";
    this.agentGoal = "";
    this.isAgent = false;
    this.topic = "";
    this.homeX = 0;
    this.homeY = 0;
    this.scheduleRole = "";
    this.npcState = "";
    this.offDuty = false;
    this.actionId = "";
  }
}
class EncounterView  {
  constructor() {
    this.entityName = "";
    this.entityChar = "";
    this.greeting = "";
    this.isHostile = false;
    this.hintLine = "";
    this.attackWarning = "";
  }
}
class MapFloor  {
  constructor() {
    this.floorId = "";
    this.title = "";
    this.rows = [];
    this.entities = [];
    this.spawnX = 0;
    this.spawnY = 0;
    this.cafeteriaX = -1;
    this.cafeteriaY = -1;
    this.doorX = -1;
    this.doorY = -1;
    let empty_1 = [];
    this.rows = empty_1;
    let emptyEnt = [];
    this.entities = emptyEnt;
  }
}
class MapView  {
  constructor() {
    this.mapTitle = "";
    this.floorTitle = "";
    this.lines = [];
    this.statusLine = "";
    this.hintLine = "";
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.cameraX = 0;
    this.cameraY = 0;
    this.playerMapX = 0;
    this.playerMapY = 0;
    this.conductLine = "";
    this.toolsLine = "";
    this.ambientLine = "";
    this.timeLine = "";
  }
}
class WorldMap  {
  constructor() {
    this.mapId = "";
    this.title = "";
    this.width = 0;
    this.height = 0;
    this.floors = [];
    this.currentFloor = 0;
    this.playerX = 0;
    this.playerY = 0;
    this.lastStatus = "";
    this.hasMap = false;
    this.foundElevatorX = 0;
    this.foundElevatorY = 0;
    this.viewPortW = 30;
    this.viewPortH = 18;
    this.cameraX = 0;
    this.cameraY = 0;
    this.facingX = 0;
    this.facingY = 1;
    this.playerHidden = false;
    this.playerAlias = "Larry";
    this.overheardMsg = "";
    this.agentHuntFlag = false;
    this.policeChaseActive = false;
    this.lastPickedOwner = "";
    this.droppedCardOwners = [];
    this.json = new StoryJson();
    let emptyFloors = [];
    this.floors = emptyFloors;
    let emptyOwners = [];
    this.droppedCardOwners = emptyOwners;
  }
  activeFloor () {
    if ( (this.floors.length) < 1 ) {
      return new MapFloor();
    }
    if ( this.currentFloor < 0 ) {
      return this.floors[0];
    }
    if ( this.currentFloor >= (this.floors.length) ) {
      return this.floors[((this.floors.length) - 1)];
    }
    return this.floors[this.currentFloor];
  };
  isBlockedTile (ch) {
    if ( ch == "#" ) {
      return true;
    }
    if ( ch == "|" ) {
      return true;
    }
    if ( ch == "+" ) {
      return true;
    }
    if ( ch == "%" ) {
      return true;
    }
    if ( ch == "L" ) {
      return true;
    }
    if ( ch == "+" ) {
      return true;
    }
    return false;
  };
  isElevatorNeighborOk (ch) {
    if ( ch == "#" ) {
      return true;
    }
    if ( ch == "." ) {
      return true;
    }
    if ( ch == " " ) {
      return true;
    }
    if ( ch == "," ) {
      return true;
    }
    if ( ch == "=" ) {
      return true;
    }
    if ( ch == "-" ) {
      return true;
    }
    return false;
  };
  isElevatorCell (x, y) {
    return this.isElevatorCellOnFloor(this.currentFloor, x, y);
  };
  isElevatorCellOnFloor (floorIndex, x, y) {
    const ch = this.tileAtOnFloor(floorIndex, x, y);
    if ( ch != "E" ) {
      return false;
    }
    const left = this.tileAtOnFloor(floorIndex, (x - 1), y);
    const right = this.tileAtOnFloor(floorIndex, (x + 1), y);
    if ( this.isElevatorNeighborOk(left) == false ) {
      return false;
    }
    if ( this.isElevatorNeighborOk(right) == false ) {
      return false;
    }
    return true;
  };
  ensurePlayerOnWalkable () {
    const cur = this.tileAt(this.playerX, this.playerY);
    if ( this.isBlockedTile(cur) == false ) {
      return;
    }
    if ( this.findElevatorOnFloor(this.currentFloor) ) {
      const ech = this.tileAt(this.foundElevatorX, this.foundElevatorY);
      if ( this.isBlockedTile(ech) == false ) {
        this.playerX = this.foundElevatorX;
        this.playerY = this.foundElevatorY;
        this.lastStatus = "Siirryit hissille — edellinen ruutu ei ollut kulkukelpoinen.";
        return;
      }
    }
    const floor = this.activeFloor();
    this.playerX = floor.spawnX;
    this.playerY = floor.spawnY;
    const sch = this.tileAt(this.playerX, this.playerY);
    if ( this.isBlockedTile(sch) == false ) {
      this.lastStatus = "Heräsit kerroksen spawn-pisteellä.";
      return;
    }
    const rows = floor.rows;
    let y = 0;
    const h = rows.length;
    while (y < h) {
      const row = rows[y];
      let x = 0;
      const w = row.length;
      while (x < w) {
        const tile = row.substring(x, (x + 1) );
        if ( this.isBlockedTile(tile) == false ) {
          this.playerX = x;
          this.playerY = y;
          this.lastStatus = "Siirryit lähimpään vapaaseen ruutuun.";
          return;
        }
        x = x + 1;
      };
      y = y + 1;
    };
  };
  isBreakableTile (ch, tool) {
    if ( tool == "crowbar" ) {
      if ( ch == "%" ) {
        return true;
      }
      if ( ch == "+" ) {
        return true;
      }
      if ( ch == "=" ) {
        return true;
      }
      return false;
    }
    if ( tool == "shovel" ) {
      if ( ch == "%" ) {
        return true;
      }
      if ( ch == "=" ) {
        return true;
      }
      return false;
    }
    if ( tool == "sledgehammer" ) {
      if ( ch == "#" ) {
        return true;
      }
      if ( ch == "%" ) {
        return true;
      }
      if ( ch == "+" ) {
        return true;
      }
      if ( ch == "=" ) {
        return true;
      }
    }
    return false;
  };
  setTileAt (x, y, ch) {
    const floor = this.activeFloor();
    let rows = floor.rows;
    if ( y < 0 ) {
      return;
    }
    if ( y >= (rows.length) ) {
      return;
    }
    const row = rows[y];
    const rowLen = row.length;
    if ( x < 0 ) {
      return;
    }
    if ( x >= rowLen ) {
      return;
    }
    const left = row.substring(0, x );
    const right = row.substring((x + 1), rowLen );
    rows[y] = (left + ch) + right;
  };
  floorCount () {
    return this.floors.length;
  };
  updateCamera () {
    const halfW = 15;
    const halfH = 9;
    this.cameraX = this.playerX - halfW;
    this.cameraY = this.playerY - halfH;
    if ( this.cameraX < 0 ) {
      this.cameraX = 0;
    }
    if ( this.cameraY < 0 ) {
      this.cameraY = 0;
    }
    if ( (this.cameraX + this.viewPortW) > this.width ) {
      this.cameraX = this.width - this.viewPortW;
    }
    if ( (this.cameraY + this.viewPortH) > this.height ) {
      this.cameraY = this.height - this.viewPortH;
    }
    if ( this.cameraX < 0 ) {
      this.cameraX = 0;
    }
    if ( this.cameraY < 0 ) {
      this.cameraY = 0;
    }
  };
  tileAt (x, y) {
    return this.tileAtOnFloor(this.currentFloor, x, y);
  };
  tileAtOnFloor (floorIndex, x, y) {
    const floor = this.floors[floorIndex];
    const rows = floor.rows;
    const h = rows.length;
    if ( y < 0 ) {
      return "#";
    }
    if ( y >= h ) {
      return "#";
    }
    if ( x < 0 ) {
      return "#";
    }
    const row = rows[y];
    const rowLen = row.length;
    if ( x >= rowLen ) {
      return "#";
    }
    return row.substring(x, (x + 1) );
  };
  entityAt (x, y) {
    const floor = this.activeFloor();
    const ents = floor.entities;
    let i = 0;
    const n = ents.length;
    let fallback = new MapEntity();
    while (i < n) {
      const e = ents[i];
      if ( e.x == x ) {
        if ( e.y == y ) {
          if ( e.offDuty == false ) {
            return e;
          }
          if ( (fallback.id.length) < 1 ) {
            fallback = e;
          }
        }
      }
      i = i + 1;
    };
    return fallback;
  };
  isOnElevator () {
    const ch = this.tileAt(this.playerX, this.playerY);
    if ( ch == "E" ) {
      return true;
    }
    return false;
  };
  inferKind (ch) {
    if ( ch == "G" ) {
      return "guru";
    }
    if ( ch == "o" ) {
      return "hostile";
    }
    if ( ch == "O" ) {
      return "hostile";
    }
    if ( ch == "M" ) {
      return "hostile";
    }
    return "role";
  };
  normalizeEntity (ent) {
    if ( (ent.name.length) < 1 ) {
      ent.name = ent.id;
    }
    if ( (ent.kind.length) < 1 ) {
      ent.kind = this.inferKind(ent.char);
    }
    if ( ent.sociability <= 0 ) {
      ent.sociability = 50;
    }
    if ( ent.persistence <= 0 ) {
      ent.persistence = 50;
    }
    if ( ent.isAgent == false ) {
      if ( ent.kind == "coworker" ) {
        ent.isAgent = true;
      }
      if ( ent.kind == "pet" ) {
        ent.isAgent = true;
        if ( (ent.moveMode.length) < 1 ) {
          ent.moveMode = "wander";
        }
      }
      if ( ent.kind == "security" ) {
        ent.isAgent = true;
      }
      if ( ent.kind == "police" ) {
        ent.isAgent = true;
      }
      if ( ent.kind == "guru" ) {
        ent.isAgent = true;
      }
      if ( ent.kind == "role" ) {
        if ( (ent.moveMode.length) > 0 ) {
          ent.isAgent = true;
        }
      }
    }
    if ( (ent.moveMode.length) < 1 ) {
      if ( ent.kind == "security" ) {
        ent.moveMode = "seek_player";
      }
      if ( ent.kind == "coworker" ) {
        ent.moveMode = "wander";
      }
      if ( ent.kind == "police" ) {
        ent.moveMode = "police_chase";
      }
    }
    if ( (ent.scheduleRole.length) > 0 ) {
      ent.isAgent = true;
      ent.moveMode = "schedule";
      if ( ent.homeX < 1 ) {
        ent.homeX = ent.x;
      }
      if ( ent.homeY < 1 ) {
        ent.homeY = ent.y;
      }
    }
  };
  trySpawnPoliceAt (x, y, slot) {
    const tile = this.tileAt(x, y);
    if ( this.isBlockedTile(tile) ) {
      return;
    }
    const other = this.entityAt(x, y);
    if ( (other.id.length) > 0 ) {
      return;
    }
    const floor = this.activeFloor();
    const p = new MapEntity();
    p.id = (("police-" + ((this.currentFloor.toString()))) + "-") + ((slot.toString()));
    p.char = "P";
    p.name = "Poliisi";
    p.kind = "police";
    p.moveMode = "police_chase";
    p.isAgent = true;
    p.persistence = 100;
    p.sociability = 0;
    p.x = x;
    p.y = y;
    let ents = floor.entities;
    ents.push(p);
    floor.entities = ents;
  };
  clearPoliceSquad () {
    this.policeChaseActive = false;
    const floor = this.activeFloor();
    const ents = floor.entities;
    let kept = [];
    let i = 0;
    const n = ents.length;
    while (i < n) {
      const e = ents[i];
      if ( e.kind != "police" ) {
        kept.push(e);
      }
      i = i + 1;
    };
    floor.entities = kept;
  };
  startPoliceChase () {
    this.clearPoliceSquad();
    this.policeChaseActive = true;
    this.trySpawnPoliceAt(this.playerX + 4, this.playerY, 0);
    this.trySpawnPoliceAt(this.playerX - 4, this.playerY, 1);
    this.trySpawnPoliceAt(this.playerX, this.playerY + 4, 2);
    this.lastStatus = "KOLME POLIISIA SAAPUI! P musta paidassa — he jahtaavat sinua!";
  };
  loadFloorEntities (entArr, loaded) {
    let ei = 0;
    const en = entArr.length;
    let loadedEnt = [];
    while (ei < en) {
      const entObj = this.json.arrayObjectAt(entArr, ei);
      const ent = new MapEntity();
      ent.id = this.json.objFieldStr(entObj, "id");
      ent.char = this.json.objFieldStr(entObj, "char");
      if ( (ent.char.length) < 1 ) {
        ent.char = "?";
      }
      ent.x = this.json.objFieldInt(entObj, "x");
      ent.y = this.json.objFieldInt(entObj, "y");
      ent.storyId = this.json.objFieldStr(entObj, "storyId");
      if ( (ent.storyId.length) < 1 ) {
        ent.storyId = this.json.objFieldStr(entObj, "template");
      }
      ent.name = this.json.objFieldStr(entObj, "name");
      ent.kind = this.json.objFieldStr(entObj, "kind");
      ent.itemTool = this.json.objFieldStr(entObj, "itemTool");
      ent.itemOwner = this.json.objFieldStr(entObj, "itemOwner");
      ent.actionId = this.json.objFieldStr(entObj, "actionId");
      ent.sociability = this.json.objFieldInt(entObj, "sociability");
      ent.persistence = this.json.objFieldInt(entObj, "persistence");
      ent.moveMode = this.json.objFieldStr(entObj, "behavior");
      ent.agentGoal = this.json.objFieldStr(entObj, "agenda");
      const agentFlag = this.json.objFieldInt(entObj, "isAgent");
      if ( agentFlag != 0 ) {
        ent.isAgent = true;
      }
      ent.topic = this.json.objFieldStr(entObj, "topic");
      ent.scheduleRole = this.json.objFieldStr(entObj, "scheduleRole");
      ent.homeX = this.json.objFieldInt(entObj, "homeX");
      ent.homeY = this.json.objFieldInt(entObj, "homeY");
      ent.npcState = this.json.objFieldStr(entObj, "npcState");
      const offFlag = this.json.objFieldInt(entObj, "offDuty");
      if ( offFlag != 0 ) {
        ent.offDuty = true;
      }
      this.normalizeEntity(ent);
      loadedEnt.push(ent);
      ei = ei + 1;
    };
    loaded.entities = loadedEnt;
  };
  loadFloorRows (rowsArr, loaded) {
    const rowCount = rowsArr.length;
    let loadedRows = [];
    let ri = 0;
    while (ri < rowCount) {
      const rowObj = this.json.arrayObjectAt(rowsArr, ri);
      loadedRows.push(this.json.objFieldStr(rowObj, "line"));
      ri = ri + 1;
    };
    loaded.rows = loadedRows;
  };
  loadSingleFloor (floorObj, loaded) {
    loaded.floorId = this.json.objFieldStr(floorObj, "id");
    loaded.title = this.json.objFieldStr(floorObj, "title");
    const rowsOpt = (floorObj["rows"] instanceof Array ) ? floorObj ["rows"] : undefined ;
    if ( (typeof(rowsOpt) === "undefined") == false ) {
      this.loadFloorRows(rowsOpt, loaded);
    }
    const entOpt = (floorObj["entities"] instanceof Array ) ? floorObj ["entities"] : undefined ;
    if ( (typeof(entOpt) === "undefined") == false ) {
      this.loadFloorEntities(entOpt, loaded);
    }
    const spawnObj = (floorObj["spawn"] instanceof Object ) ? floorObj ["spawn"] : undefined ;
    if ( (typeof(spawnObj) === "undefined") == false ) {
      const spawn = spawnObj;
      loaded.spawnX = this.json.objFieldInt(spawn, "x");
      loaded.spawnY = this.json.objFieldInt(spawn, "y");
    }
    const cafObj = (floorObj["cafeteria"] instanceof Object ) ? floorObj ["cafeteria"] : undefined ;
    if ( (typeof(cafObj) === "undefined") == false ) {
      const caf = cafObj;
      loaded.cafeteriaX = this.json.objFieldInt(caf, "x");
      loaded.cafeteriaY = this.json.objFieldInt(caf, "y");
    }
    const doorObj = (floorObj["door"] instanceof Object ) ? floorObj ["door"] : undefined ;
    if ( (typeof(doorObj) === "undefined") == false ) {
      const door = doorObj;
      loaded.doorX = this.json.objFieldInt(door, "x");
      loaded.doorY = this.json.objFieldInt(door, "y");
    }
  };
  recomputeSize () {
    const floor = this.activeFloor();
    const rows = floor.rows;
    const rowCount = rows.length;
    this.height = rowCount;
    if ( rowCount < 1 ) {
      this.width = 0;
      return;
    }
    let w = 0;
    let wi = 0;
    while (wi < rowCount) {
      const __len = (rows[wi]).length;
      if ( __len > w ) {
        w = __len;
      }
      wi = wi + 1;
    };
    this.width = w;
  };
  loadFromText (mapJson) {
    try {
      const rootOpt = JSON.parse(mapJson);
      if ( typeof(rootOpt) === "undefined" ) {
        this.hasMap = false;
        return false;
      }
      this.root = rootOpt;
    } catch(e) {
      this.hasMap = false;
      return false;
    }
    this.mapId = this.json.objFieldStr((this.root), "id");
    this.title = this.json.objFieldStr((this.root), "title");
    this.currentFloor = this.json.objFieldInt((this.root), "startFloor");
    const floorsOpt = ((this.root)["floors"] instanceof Array ) ? (this.root) ["floors"] : undefined ;
    if ( typeof(floorsOpt) === "undefined" ) {
      this.hasMap = false;
      return false;
    }
    const floorsArr = floorsOpt;
    const floorCount = floorsArr.length;
    if ( floorCount < 1 ) {
      this.hasMap = false;
      return false;
    }
    let loadedFloors = [];
    let fi = 0;
    while (fi < floorCount) {
      const floorObj = this.json.arrayObjectAt(floorsArr, fi);
      const floor = new MapFloor();
      this.loadSingleFloor(floorObj, floor);
      loadedFloors.push(floor);
      fi = fi + 1;
    };
    this.floors = loadedFloors;
    const start = this.activeFloor();
    this.playerX = start.spawnX;
    this.playerY = start.spawnY;
    this.playerAlias = this.json.objFieldStr((this.root), "playerAlias");
    if ( (this.playerAlias.length) < 1 ) {
      this.playerAlias = "Larry";
    }
    this.playerHidden = false;
    this.overheardMsg = "";
    this.recomputeSize();
    this.ensurePlayerOnWalkable();
    this.lastStatus = "";
    this.hasMap = true;
    return true;
  };
  findElevatorOnFloor (floorIndex) {
    return this.findElevatorAt(floorIndex);
  };
  findElevatorAt (floorIndex) {
    const floor = this.floors[floorIndex];
    const rows = floor.rows;
    let y = 0;
    const h = rows.length;
    while (y < h) {
      const row = rows[y];
      let x = 0;
      const w = row.length;
      while (x < w) {
        const ch = row.substring(x, (x + 1) );
        if ( ch == "E" ) {
          if ( this.isElevatorCellOnFloor(floorIndex, x, y) ) {
            this.foundElevatorX = x;
            this.foundElevatorY = y;
            return true;
          }
        }
        x = x + 1;
      };
      y = y + 1;
    };
    return false;
  };
  tryElevatorTo (targetFloor) {
    if ( this.hasMap == false ) {
      return false;
    }
    if ( this.isOnElevator() == false ) {
      this.lastStatus = "Hissi on vain E-ruudulla.";
      return false;
    }
    const floorCount = this.floors.length;
    if ( targetFloor < 0 ) {
      return false;
    }
    if ( targetFloor >= floorCount ) {
      this.lastStatus = "Kerrosta ei ole.";
      return false;
    }
    if ( targetFloor == this.currentFloor ) {
      this.lastStatus = "Olet jo tällä kerroksella.";
      return false;
    }
    if ( this.findElevatorOnFloor(targetFloor) == false ) {
      this.lastStatus = "Hissiä ei ole kohdekerroksessa.";
      return false;
    }
    this.currentFloor = targetFloor;
    this.playerX = this.foundElevatorX;
    this.playerY = this.foundElevatorY;
    this.recomputeSize();
    this.ensurePlayerOnWalkable();
    const floor = this.activeFloor();
    this.lastStatus = "Hissi: " + floor.title;
    return true;
  };
  tryMove (dx, dy) {
    if ( this.hasMap == false ) {
      return false;
    }
    if ( dx != 0 ) {
      this.facingX = dx;
      this.facingY = 0;
    }
    if ( dy != 0 ) {
      this.facingX = 0;
      this.facingY = dy;
    }
    const nx = this.playerX + dx;
    const ny = this.playerY + dy;
    const tile = this.tileAt(nx, ny);
    if ( this.isBlockedTile(tile) ) {
      this.lastStatus = "Este — tarvitset ehkä työkalun (x).";
      return false;
    }
    const blocker = this.entityAt(nx, ny);
    if ( (blocker.id.length) > 0 ) {
      if ( blocker.kind != "item" ) {
        this.lastStatus = "Tiellä on joku.";
        return false;
      }
    }
    this.playerHidden = false;
    this.playerX = nx;
    this.playerY = ny;
    if ( this.isOnElevator() ) {
      this.lastStatus = "Hissi — 1-9/0 vaihtaa kerrosta.";
    } else {
      this.lastStatus = "";
    }
    return true;
  };
  removeEntityAt (x, y) {
    const floor = this.activeFloor();
    const ents = floor.entities;
    let kept = [];
    let i = 0;
    const n = ents.length;
    while (i < n) {
      const e = ents[i];
      if ( e.x == x ) {
        if ( e.y == y ) {
          i = i + 1;
          continue;
        }
      }
      kept.push(e);
      i = i + 1;
    };
    floor.entities = kept;
  };
  pickupItemAt (x, y) {
    const e = this.entityAt(x, y);
    if ( (e.id.length) < 1 ) {
      return "";
    }
    if ( e.kind != "item" ) {
      return "";
    }
    if ( (e.itemTool.length) < 1 ) {
      return "";
    }
    const pick = e.itemTool;
    this.lastPickedOwner = e.itemOwner;
    this.removeEntityAt(x, y);
    this.setTileAt(x, y, ".");
    return pick;
  };
  hasDroppedCardFrom (coworkerId) {
    let i = 0;
    const n = this.droppedCardOwners.length;
    while (i < n) {
      if ( (this.droppedCardOwners[i]) == coworkerId ) {
        return true;
      }
      i = i + 1;
    };
    return false;
  };
  markDroppedCardFrom (coworkerId) {
    if ( this.hasDroppedCardFrom(coworkerId) ) {
      return;
    }
    this.droppedCardOwners.push(coworkerId);
  };
  tryCoworkerDropCard (coworker) {
    if ( coworker.kind != "coworker" ) {
      return false;
    }
    if ( this.hasDroppedCardFrom(coworker.id) ) {
      return false;
    }
    const roll = Math.floor(Math.random()*(24 - 0 + 1) + 0);
    if ( roll != 0 ) {
      return false;
    }
    let dirs = [];
    dirs.push(1);
    dirs.push(-1);
    dirs.push(0);
    dirs.push(0);
    let dy = [];
    dy.push(0);
    dy.push(0);
    dy.push(1);
    dy.push(-1);
    let di = 0;
    while (di < 4) {
      const nx = coworker.x + (dirs[di]);
      const ny = coworker.y + (dy[di]);
      const tile = this.tileAt(nx, ny);
      if ( this.isBlockedTile(tile) ) {
        di = di + 1;
        continue;
      }
      const other = this.entityAt(nx, ny);
      if ( (other.id.length) > 0 ) {
        di = di + 1;
        continue;
      }
      const floor = this.activeFloor();
      const item = new MapEntity();
      item.id = "dropped-card-" + coworker.id;
      item.char = "k";
      item.name = "Kulkukortti";
      item.kind = "item";
      item.itemTool = "coworker_card";
      item.itemOwner = coworker.id;
      item.x = nx;
      item.y = ny;
      let ents = floor.entities;
      ents.push(item);
      floor.entities = ents;
      this.markDroppedCardFrom(coworker.id);
      this.overheardMsg = coworker.name + " pudotti jotain lattialle!";
      return true;
    };
    return false;
  };
  openTileAt (x, y) {
    const tile = this.tileAt(x, y);
    if ( tile == "L" ) {
      this.setTileAt(x, y, ".");
      return;
    }
    if ( tile == "+" ) {
      this.setTileAt(x, y, ".");
      return;
    }
    if ( tile == "%" ) {
      this.setTileAt(x, y, ".");
    }
  };
  tryBreakFacing (tool) {
    if ( (tool.length) < 1 ) {
      this.lastStatus = "Ei valittua työkalua (t vaihtaa).";
      return "";
    }
    const tx = this.playerX + this.facingX;
    const ty = this.playerY + this.facingY;
    const tile = this.tileAt(tx, ty);
    if ( this.isBreakableTile(tile, tool) == false ) {
      this.lastStatus = "Työkalu ei tepsi tähän esteeseen.";
      return "";
    }
    this.setTileAt(tx, ty, ".");
    if ( tool == "sledgehammer" ) {
      this.lastStatus = "Moukarivasara murskaa seinän — melu kantautuu!";
      return "heavy";
    }
    if ( tool == "crowbar" ) {
      this.lastStatus = "Sorkkarauta taivuttaa esteen.";
      return "medium";
    }
    this.lastStatus = "Lapio avaa raon hiljaa.";
    return "light";
  };
  tryToggleHide () {
    if ( this.playerHidden ) {
      this.playerHidden = false;
      this.lastStatus = "Nouset esiin.";
      return true;
    }
    const tile = this.tileAt(this.playerX, this.playerY);
    if ( tile == "=" ) {
      this.playerHidden = true;
      this.lastStatus = "Piiloudut kopin taakse.";
      return true;
    }
    return false;
  };
  canNpcSeePlayer (e) {
    if ( this.playerHidden == false ) {
      return true;
    }
    if ( e.persistence >= 90 ) {
      return true;
    }
    return false;
  };
  isActiveAgent (e) {
    if ( e.isAgent == false ) {
      return false;
    }
    if ( e.kind == "item" ) {
      return false;
    }
    if ( (e.id.length) < 1 ) {
      return false;
    }
    return true;
  };
  stepTowardPlayer (e) {
    let dx = 0;
    let dy = 0;
    if ( e.x < this.playerX ) {
      dx = 1;
    }
    if ( e.x > this.playerX ) {
      dx = -1;
    }
    if ( dx == 0 ) {
      if ( e.y < this.playerY ) {
        dy = 1;
      }
      if ( e.y > this.playerY ) {
        dy = -1;
      }
    }
    this.tryMoveEntity(e, dx, dy);
  };
  stepWander (e) {
    const roll = Math.floor(Math.random()*(3 - 0 + 1) + 0);
    let dx = 0;
    let dy = 0;
    if ( roll == 0 ) {
      dx = 1;
    }
    if ( roll == 1 ) {
      dx = -1;
    }
    if ( roll == 2 ) {
      dy = 1;
    }
    if ( roll == 3 ) {
      dy = -1;
    }
    this.tryMoveEntity(e, dx, dy);
  };
  tryMoveEntity (e, dx, dy) {
    const nx = e.x + dx;
    const ny = e.y + dy;
    const tile = this.tileAt(nx, ny);
    if ( this.isBlockedTile(tile) ) {
      return;
    }
    const other = this.entityAt(nx, ny);
    if ( (other.id.length) > 0 ) {
      if ( other.kind != "item" ) {
        return;
      }
    }
    e.x = nx;
    e.y = ny;
  };
  teleportToPrison () {
    const floor = this.activeFloor();
    const rows = floor.rows;
    let y = 0;
    const h = rows.length;
    while (y < h) {
      const row = rows[y];
      let x = 0;
      const w = row.length;
      while (x < w) {
        const ch = row.substring(x, (x + 1) );
        if ( ch == "J" ) {
          this.playerX = x;
          this.playerY = y;
          this.lastStatus = "Turvallisuus vangitsi sinut.";
          return;
        }
        x = x + 1;
      };
      y = y + 1;
    };
    this.playerX = floor.spawnX;
    this.playerY = floor.spawnY;
    this.lastStatus = "Turvallisuus vangitsi sinut.";
  };
  bumpAtPlayer () {
    if ( this.playerHidden ) {
      return new MapEntity();
    }
    const e = this.entityAt(this.playerX, this.playerY);
    if ( (e.id.length) > 0 ) {
      return e;
    }
    return new MapEntity();
  };
  emitAmbient (e, line) {
    this.overheardMsg = ((e.name + ": \"") + line) + "\"";
  };
  tryAgentAmbient (e) {
    if ( e.agentGoal != "seek_larry" ) {
      return;
    }
    if ( this.playerHidden == false ) {
      return;
    }
    const distSq = ((e.x - this.playerX) * (e.x - this.playerX)) + ((e.y - this.playerY) * (e.y - this.playerY));
    if ( distSq > 36 ) {
      return;
    }
    const roll = Math.floor(Math.random()*(2 - 0 + 1) + 0);
    if ( roll == 0 ) {
      this.emitAmbient(e, ("Oletko nähnyt " + this.playerAlias) + "?");
    }
    if ( roll == 1 ) {
      this.emitAmbient(e, ("Missä " + this.playerAlias) + " on?");
    }
  };
  stepTowardTile (e, tx, ty) {
    if ( e.x == tx ) {
      if ( e.y == ty ) {
        return;
      }
    }
    let dx = 0;
    let dy = 0;
    if ( e.x < tx ) {
      dx = 1;
    }
    if ( e.x > tx ) {
      dx = -1;
    }
    if ( dx == 0 ) {
      if ( e.y < ty ) {
        dy = 1;
      }
      if ( e.y > ty ) {
        dy = -1;
      }
    }
    if ( dx != 0 ) {
      if ( dy != 0 ) {
        const pick = Math.floor(Math.random()*(1 - 0 + 1) + 0);
        if ( pick == 0 ) {
          dy = 0;
        }
        if ( pick == 1 ) {
          dx = 0;
        }
      }
    }
    this.tryMoveEntity(e, dx, dy);
  };
  scheduleMoveStride (e, gameMinutes) {
    const seed = (e.homeX + (e.homeY * 3)) + (e.id.length);
    const phase = seed % 4;
    const tick = gameMinutes % 4;
    if ( phase == tick ) {
      return true;
    }
    return false;
  };
  applyEntitySchedule (floorIndex, floor, e, gameMinutes) {
    if ( (e.scheduleRole.length) < 1 ) {
      return;
    }
    if ( e.scheduleRole == "janitor" ) {
      return;
    }
    if ( gameMinutes < 480 ) {
      e.offDuty = true;
      return;
    }
    if ( gameMinutes >= 1020 ) {
      e.offDuty = true;
      e.npcState = "gone";
      return;
    }
    if ( e.scheduleRole == "ceo_lunch" ) {
      if ( gameMinutes >= 660 ) {
        if ( gameMinutes < 780 ) {
          e.offDuty = false;
          e.npcState = "lunch_out";
          if ( floor.doorX >= 0 ) {
            this.stepTowardTile(e, floor.doorX, floor.doorY);
          }
          return;
        }
      }
      e.offDuty = true;
      return;
    }
    if ( e.scheduleRole == "ceo" ) {
      if ( gameMinutes >= 660 ) {
        if ( gameMinutes < 780 ) {
          e.offDuty = true;
          e.npcState = "lunch_out";
          return;
        }
      }
    }
    if ( e.scheduleRole == "mentor" ) {
      e.offDuty = false;
      e.npcState = "desk";
      this.stepTowardTile(e, e.homeX, e.homeY);
      return;
    }
    e.offDuty = false;
    let tx = e.homeX;
    let ty = e.homeY;
    if ( e.homeX < 1 ) {
      tx = e.x;
      ty = e.y;
    }
    e.npcState = "desk";
    if ( gameMinutes >= 660 ) {
      if ( gameMinutes < 780 ) {
        if ( e.scheduleRole == "desk_lunch" ) {
          e.npcState = "desk_lunch";
        }
        if ( e.scheduleRole != "desk_lunch" ) {
          if ( floor.cafeteriaX >= 0 ) {
            const slot = (e.homeX + e.homeY) % 5;
            tx = (floor.cafeteriaX + slot) - 2;
            ty = floor.cafeteriaY + (slot % 2);
            e.npcState = "lunch";
          }
        }
      }
    }
    if ( gameMinutes >= 900 ) {
      if ( gameMinutes < 1020 ) {
        if ( this.findElevatorAt(floorIndex) ) {
          tx = this.foundElevatorX;
          ty = this.foundElevatorY;
          e.npcState = "leaving";
        }
      }
    }
    if ( this.scheduleMoveStride(e, gameMinutes) == false ) {
      return;
    }
    this.stepTowardTile(e, tx, ty);
  };
  tickSchedules (gameMinutes) {
    const floor = this.activeFloor();
    const ents = floor.entities;
    let i = 0;
    const n = ents.length;
    while (i < n) {
      const e = ents[i];
      if ( this.isActiveAgent(e) ) {
        this.applyEntitySchedule(this.currentFloor, floor, e, gameMinutes);
      }
      i = i + 1;
    };
  };
  tickAgents () {
    this.overheardMsg = "";
    const empty = new MapEntity();
    const floor = this.activeFloor();
    const ents = floor.entities;
    let i = 0;
    const n = ents.length;
    let approach = empty;
    while (i < n) {
      const e = ents[i];
      if ( this.isActiveAgent(e) == false ) {
        i = i + 1;
        continue;
      }
      this.tryAgentAmbient(e);
      if ( e.kind == "police" ) {
        if ( this.policeChaseActive == false ) {
          i = i + 1;
          continue;
        }
        if ( this.playerHidden == false ) {
          this.stepTowardPlayer(e);
          if ( e.x == this.playerX ) {
            if ( e.y == this.playerY ) {
              return e;
            }
          }
        }
        i = i + 1;
        continue;
      }
      if ( e.kind == "security" ) {
        if ( this.agentHuntFlag == false ) {
          i = i + 1;
          continue;
        }
        if ( this.canNpcSeePlayer(e) ) {
          this.stepTowardPlayer(e);
          if ( e.x == this.playerX ) {
            if ( e.y == this.playerY ) {
              return e;
            }
          }
        }
        i = i + 1;
        continue;
      }
      if ( e.moveMode == "schedule" ) {
        i = i + 1;
        continue;
      }
      if ( e.moveMode == "seek_player" ) {
        if ( this.canNpcSeePlayer(e) ) {
          this.stepTowardPlayer(e);
        }
      }
      if ( e.moveMode == "wander" ) {
        const wanderRoll = Math.floor(Math.random()*(2 - 0 + 1) + 0);
        if ( wanderRoll == 0 ) {
          this.stepWander(e);
        }
        if ( e.kind == "coworker" ) {
          this.tryCoworkerDropCard(e);
        }
      }
      if ( e.moveMode == "patrol" ) {
        const patrolRoll = Math.floor(Math.random()*(3 - 0 + 1) + 0);
        if ( patrolRoll == 0 ) {
          this.stepWander(e);
        }
      }
      let dx = e.x - this.playerX;
      if ( dx < 0 ) {
        dx = 0 - dx;
      }
      let dy = e.y - this.playerY;
      if ( dy < 0 ) {
        dy = 0 - dy;
      }
      const manhattan = dx + dy;
      if ( manhattan <= 1 ) {
        if ( e.sociability >= 70 ) {
          if ( this.canNpcSeePlayer(e) ) {
            if ( (e.storyId.length) > 0 ) {
              approach = e;
            }
            if ( e.agentGoal == "socialize" ) {
              approach = e;
            }
          }
        }
      }
      i = i + 1;
    };
    if ( (approach.id.length) > 0 ) {
      return approach;
    }
    return empty;
  };
  roleDisplayChar (ent) {
    if ( (ent.id.length) < 1 ) {
      return "?";
    }
    if ( ent.kind == "action" ) {
      return ent.char;
    }
    if ( ent.kind == "item" ) {
      return ent.char;
    }
    if ( ent.kind == "coworker" ) {
      return "t";
    }
    if ( ent.kind == "guru" ) {
      return "g";
    }
    if ( ent.kind == "pet" ) {
      return ent.char;
    }
    if ( ent.kind == "security" ) {
      return "u";
    }
    if ( ent.kind == "police" ) {
      return ent.char;
    }
    if ( ent.kind == "hostile" ) {
      return ent.char;
    }
    if ( ent.kind == "role" ) {
      if ( ent.id == "receptionist" ) {
        return "v";
      }
      if ( ent.char == "C" ) {
        return "T";
      }
      if ( ent.char == "S" ) {
        return "s";
      }
      if ( ent.char == "P" ) {
        return "p";
      }
      if ( ent.char == "u" ) {
        return "k";
      }
      return ent.char;
    }
    return ent.char;
  };
  renderChar (x, y) {
    if ( x == this.playerX ) {
      if ( y == this.playerY ) {
        if ( this.playerHidden ) {
          return this.tileAt(x, y);
        }
        return "@";
      }
    }
    const e = this.entityAt(x, y);
    if ( (e.id.length) > 0 ) {
      if ( e.offDuty ) {
        return this.tileAt(x, y);
      }
      return this.roleDisplayChar(e);
    }
    return this.tileAt(x, y);
  };
  getView () {
    const view = new MapView();
    const floor = this.activeFloor();
    view.mapTitle = this.title;
    view.floorTitle = floor.title;
    this.updateCamera();
    let lines = [];
    let vy = 0;
    while (vy < this.viewPortH) {
      const mapY = this.cameraY + vy;
      let line = "";
      let vx = 0;
      while (vx < this.viewPortW) {
        const mapX = this.cameraX + vx;
        line = line + this.renderChar(mapX, mapY);
        vx = vx + 1;
      };
      lines.push(line);
      vy = vy + 1;
    };
    view.lines = lines;
    view.mapWidth = this.width;
    view.mapHeight = this.height;
    view.cameraX = this.cameraX;
    view.cameraY = this.cameraY;
    view.playerMapX = this.playerX;
    view.playerMapY = this.playerY;
    view.statusLine = this.lastStatus;
    view.ambientLine = this.overheardMsg;
    if ( this.policeChaseActive ) {
      view.hintLine = "⚠ POLIISIT TAKAA-AJAVAT! Juokse käytävää pitkin!";
    } else {
      view.hintLine = "wasd | h=piiloudu | i=inventaario | b=opiskelulista | t/x=työkalu | 1-9/0=hissi | ?=oppitunnit | q=lopeta";
    }
    return view;
  };
}
class PlayerConduct  {
  constructor() {
    this.misconduct = 0;
    this.propertyDamage = 0;
    this.arrested = false;
    this.prisonTurns = 0;
  }
  addMisconduct (amount) {
    if ( amount <= 0 ) {
      return;
    }
    this.misconduct = this.misconduct + amount;
  };
  addDamage (amount) {
    if ( amount <= 0 ) {
      return;
    }
    this.propertyDamage = this.propertyDamage + amount;
  };
  isWanted () {
    if ( this.propriety() <= 85 ) {
      return true;
    }
    if ( this.propertyDamage >= 12 ) {
      return true;
    }
    return false;
  };
  propriety () {
    const score = 100 - this.misconduct;
    if ( score < 0 ) {
      return 0;
    }
    return score;
  };
  arrest () {
    this.arrested = true;
    this.prisonTurns = 5;
  };
  tickPrison () {
    if ( this.arrested == false ) {
      return false;
    }
    this.prisonTurns = this.prisonTurns - 1;
    if ( this.prisonTurns <= 0 ) {
      this.arrested = false;
      this.prisonTurns = 0;
      this.misconduct = this.misconduct - 5;
      if ( this.misconduct < 0 ) {
        this.misconduct = 0;
      }
      return true;
    }
    return false;
  };
}
class PlayerTools  {
  constructor() {
    this.hasCrowbar = false;
    this.hasShovel = false;
    this.hasSledgehammer = false;
    this.hasStolenCard = false;
    this.hasOfficialBadge = false;
    this.hasPromotedCard = false;
    this.hasShedKey = false;
    this.hasUsbDrive = false;
    this.heldCoworkerCardOwner = "";
    this.accessTier = 0;
    this.activeTool = "";
  }
  recalcAccessTier () {
    let t = 0;
    if ( this.hasStolenCard ) {
      t = 1;
    }
    if ( (this.heldCoworkerCardOwner.length) > 0 ) {
      if ( t < 2 ) {
        t = 2;
      }
    }
    if ( this.hasPromotedCard ) {
      if ( t < 3 ) {
        t = 3;
      }
    }
    if ( this.hasOfficialBadge ) {
      t = 4;
    }
    this.accessTier = t;
  };
  grant (toolId) {
    if ( toolId == "crowbar" ) {
      this.hasCrowbar = true;
      this.activeTool = "crowbar";
      return;
    }
    if ( toolId == "shovel" ) {
      this.hasShovel = true;
      this.activeTool = "shovel";
      return;
    }
    if ( toolId == "sledgehammer" ) {
      this.hasSledgehammer = true;
      this.activeTool = "sledgehammer";
      return;
    }
    if ( toolId == "access_card" ) {
      this.hasStolenCard = true;
      this.recalcAccessTier();
      return;
    }
    if ( toolId == "coworker_card" ) {
      this.recalcAccessTier();
      return;
    }
    if ( toolId == "promoted_card" ) {
      this.hasPromotedCard = true;
      this.recalcAccessTier();
      return;
    }
    if ( toolId == "official_badge" ) {
      this.hasOfficialBadge = true;
      this.hasStolenCard = false;
      this.heldCoworkerCardOwner = "";
      this.recalcAccessTier();
      return;
    }
    if ( toolId == "shed_key" ) {
      this.hasShedKey = true;
      return;
    }
    if ( toolId == "usb_drive" ) {
      this.hasUsbDrive = true;
    }
  };
  setCoworkerCardOwner (ownerId) {
    this.heldCoworkerCardOwner = ownerId;
    this.recalcAccessTier();
  };
  returnCoworkerCard () {
    this.heldCoworkerCardOwner = "";
    this.recalcAccessTier();
  };
  hasBuildingAccess () {
    if ( this.accessTier >= 1 ) {
      return true;
    }
    return false;
  };
  hasAny () {
    if ( this.hasCrowbar ) {
      return true;
    }
    if ( this.hasShovel ) {
      return true;
    }
    if ( this.hasSledgehammer ) {
      return true;
    }
    return false;
  };
  cycleActive () {
    if ( this.hasCrowbar ) {
      if ( this.activeTool != "crowbar" ) {
        this.activeTool = "crowbar";
        return;
      }
    }
    if ( this.hasShovel ) {
      if ( this.activeTool != "shovel" ) {
        this.activeTool = "shovel";
        return;
      }
    }
    if ( this.hasSledgehammer ) {
      if ( this.activeTool != "sledgehammer" ) {
        this.activeTool = "sledgehammer";
        return;
      }
    }
    if ( this.hasCrowbar ) {
      this.activeTool = "crowbar";
      return;
    }
    if ( this.hasShovel ) {
      this.activeTool = "shovel";
      return;
    }
    this.activeTool = "sledgehammer";
  };
  activeLabel () {
    if ( this.activeTool == "crowbar" ) {
      return "vasara";
    }
    if ( this.activeTool == "shovel" ) {
      return "lapio";
    }
    if ( this.activeTool == "sledgehammer" ) {
      return "kivivasara";
    }
    return "-";
  };
  accessLabel () {
    if ( this.accessTier == 0 ) {
      return "ei kulkuoikeutta";
    }
    if ( this.accessTier == 1 ) {
      return "kadonnut kortti (taso 1)";
    }
    if ( this.accessTier == 2 ) {
      return "työkaverin kortti (taso 2)";
    }
    if ( this.accessTier == 3 ) {
      return "suositus / ylennyskortti (taso 3)";
    }
    return "virallinen kulkulupa (taso 4)";
  };
  pickupLabel (itemId) {
    if ( itemId == "access_card" ) {
      return "kadonnut kulkukortti";
    }
    if ( itemId == "coworker_card" ) {
      return "löydetty kulkukortti";
    }
    if ( itemId == "official_badge" ) {
      return "virallinen kulkulupa";
    }
    if ( itemId == "shed_key" ) {
      return "vajan avain";
    }
    if ( itemId == "usb_drive" ) {
      return "USB-tikku";
    }
    return this.activeLabel();
  };
  fillInventory (view) {
    let lines = [];
    lines.push("── Työkalut ──");
    if ( this.hasCrowbar ) {
      lines.push("  vasara (sorkkarauta)");
    }
    if ( this.hasShovel ) {
      lines.push("  lapio");
    }
    if ( this.hasSledgehammer ) {
      lines.push("  kivivasara");
    }
    if ( this.hasAny() == false ) {
      lines.push("  (ei työkaluja)");
    }
    if ( (this.activeTool.length) > 0 ) {
      if ( this.hasAny() ) {
        lines.push("  valittu: " + this.activeLabel());
      }
    }
    lines.push("");
    lines.push("── Oikeudet ──");
    lines.push("  " + this.accessLabel());
    if ( this.hasShedKey ) {
      lines.push("  vajan avain");
    }
    if ( this.hasUsbDrive ) {
      lines.push("  USB-tikku");
    }
    if ( (this.heldCoworkerCardOwner.length) > 0 ) {
      lines.push("  lainattu kortti (palauta omistajalle)");
    }
    lines.push("");
    lines.push("── Hissi ──");
    if ( this.accessTier >= 4 ) {
      lines.push("  1.–2. kerros + 10. kerros (johto)");
    } else {
      if ( this.accessTier >= 3 ) {
        lines.push("  1.–2. kerros (+ ylemmät kun avautuvat)");
      } else {
        if ( this.accessTier >= 1 ) {
          lines.push("  1.–2. kerros (pihamaa + avokonttori)");
        } else {
          lines.push("  vain pihamaa");
        }
      }
    }
    view.lines = lines;
  };
}
class InventoryView  {
  constructor() {
    this.lines = [];
  }
}
class WorldClock  {
  constructor() {
    this.gameMinutes = 480;
  }
  advance (delta) {
    this.gameMinutes = this.gameMinutes + delta;
    if ( this.gameMinutes >= 1080 ) {
      this.gameMinutes = 480;
    }
  };
  phaseLabel () {
    if ( this.gameMinutes < 660 ) {
      return "aamu";
    }
    if ( this.gameMinutes < 780 ) {
      return "lounas";
    }
    if ( this.gameMinutes < 900 ) {
      return "iltapäivä";
    }
    if ( this.gameMinutes < 1020 ) {
      return "lähtöaika";
    }
    return "tyhjä toimisto";
  };
  pad2 (n) {
    if ( n < 10 ) {
      return "0" + ((n.toString()));
    }
    return (n.toString());
  };
  formatTime () {
    const h = Math.floor( (this.gameMinutes / 60));
    const m = this.gameMinutes - (h * 60);
    return (this.pad2(h) + ":") + this.pad2(m);
  };
  formatLine () {
    return (this.formatTime() + " — ") + this.phaseLabel();
  };
}
class GameSession  extends RangerProcessBase {
  constructor() {
    super()
    this.screen = "map";
    this.shouldQuit = false;
    this.pendingStoryId = "";
    this.menuMessage = "";
    this.engineReady = false;
    this.pendingEntityId = "";
    this.pendingEntityChar = "";
    this.pendingEntityName = "";
    this.pendingEntityKind = "";
    this.encounterResult = "";
    this.encounterCooldown = 0;
    this.interviewPassed = false;
    this.interviewFailed = false;
    this.usedStolenCardEntry = false;
    this.guruIntroPassed = false;
    this.guruStoryAttempted = false;
    this.guruQuizCorrect = 0;
    this.quizWinsForPromotion = 0;
    this.karma = new FeatureKarma();
    this._map = new WorldMap();
    this.catalog = new StoryCatalog();
    this.conduct = new PlayerConduct();
    this.tools = new PlayerTools();
    this.worldClock = new WorldClock();
  }
  ensureEngine () {
    if ( this.engineReady ) {
      return;
    }
    const eng = new StoryEngine();
    eng.karma = this.karma;
    this.engine = eng;
    this.engineReady = true;
  };
  start () {
    this.ensureEngine();
  };
  isHostileEncounter () {
    if ( this.pendingEntityKind == "hostile" ) {
      return true;
    }
    return false;
  };
  isCeoEncounter () {
    if ( (this.pendingEntityId.length) >= 4 ) {
      const prefix = this.pendingEntityId.substring(0, 4 );
      if ( prefix == "ceo-" ) {
        return true;
      }
    }
    if ( this.pendingEntityKind == "role" ) {
      if ( this.pendingEntityChar == "C" ) {
        return true;
      }
    }
    return false;
  };
  isCoworkerEncounter () {
    if ( this.pendingEntityKind == "coworker" ) {
      return true;
    }
    return false;
  };
  needsEncounterQuiz () {
    if ( this.pendingEntityId == "receptionist" ) {
      if ( this.interviewPassed ) {
        return false;
      }
      return true;
    }
    if ( this.pendingEntityKind == "guru" ) {
      if ( this.guruIntroPassed ) {
        return false;
      }
      return true;
    }
    if ( (this.pendingStoryId.length) > 0 ) {
      return false;
    }
    if ( (this.pendingEntityKind.length) < 1 ) {
      return false;
    }
    if ( this.pendingEntityKind == "item" ) {
      return false;
    }
    return true;
  };
  finishEncounterQuiz (correct, featureId, points, msg) {
    if ( correct ) {
      if ( (featureId.length) > 0 ) {
        this.karma.add(featureId, points);
      }
      let status = (("✓ " + this.pendingEntityName) + ": ") + msg;
      if ( this.isCoworkerEncounter() ) {
        this.quizWinsForPromotion = this.quizWinsForPromotion + 1;
        let promoRoll = Math.floor(Math.random()*(2 - 0 + 1) + 0);
        if ( this.quizWinsForPromotion >= 2 ) {
          promoRoll = 0;
        }
        if ( promoRoll == 0 ) {
          if ( this.tools.accessTier < 3 ) {
            this.tools.grant("promoted_card");
            this.quizWinsForPromotion = 0;
            status = status + " Sait suosituksen ylemmäs — uusi kulkukortti (taso 3)!";
          }
        }
      }
      if ( this.pendingEntityKind == "guru" ) {
        this.guruQuizCorrect = this.guruQuizCorrect + 1;
        if ( this.guruQuizCorrect >= 2 ) {
          this.guruIntroPassed = true;
          status = status + " Guru hyväksyi perusteet. Hae ylennyskortti työkavereilta (2 oikeaa) — sitten 10. kerros virallisella luvalla.";
        } else {
          status = ((status + " (") + ((this.guruQuizCorrect.toString()))) + "/2 oikein Guru-tarkistukseen)";
        }
      }
      if ( this.pendingEntityId == "receptionist" ) {
        this.tools.grant("official_badge");
        this.interviewPassed = true;
        this.interviewFailed = false;
        status = status + " Sait virallisen kulkuluvan — haastattelu meni läpi!";
      }
      this._map.lastStatus = status;
    } else {
      this.karma.loseKarma(3);
      let failStatus = (("✗ " + this.pendingEntityName) + ": ") + msg;
      if ( this.pendingEntityId == "receptionist" ) {
        this.interviewFailed = true;
        this.interviewPassed = false;
        failStatus = failStatus + " Haastattelu ei mennyt läpi. Voit yrittää uudelleen tai käyttää varastettua korttia — riskillä.";
      }
      this._map.lastStatus = failStatus;
    }
    this.clearEncounter();
    this.screen = "map";
    this.markStateDirty();
  };
  askEncounterAiStudy (cost) {
    const total = this.karma.total();
    if ( total < cost ) {
      return false;
    }
    this.karma.loseKarma(cost);
    this.markStateDirty();
    return true;
  };
  dismissEncounterQuiz (tone, npcReply) {
    if ( tone == "meh" ) {
      this.karma.loseKarma(1);
      this._map.lastStatus = npcReply;
    } else {
      this._map.lastStatus = npcReply;
    }
    this.clearEncounter();
    this.screen = "map";
    this.markStateDirty();
  };
  encounterAiStudyCost () {
    return 5;
  };
  gameOverPolice () {
    this.ensureEngine();
    this.engine.deaths = this.engine.deaths + 1;
    this._map.clearPoliceSquad();
    const floor = this._map.activeFloor();
    this._map.playerX = floor.spawnX;
    this._map.playerY = floor.spawnY;
    this._map.playerHidden = false;
    this._map.ensurePlayerOnWalkable();
    this._map.lastStatus = "";
    this.screen = "gameover";
    this.markStateDirty();
  };
  triggerPoliceChaseAfterAttack (victimName) {
    this.karma.loseKarma(12);
    this.conduct.addMisconduct(22);
    this._map.startPoliceChase();
    this._map.lastStatus = victimName + " huusi apua! Kolme poliisia (P) saapui — mustat paidat, takaa-ajo alussa!";
    this.encounterResult = "attack";
    this.clearEncounter();
    this.screen = "map";
    this.markStateDirty();
  };
  encounterGreeting () {
    if ( this.pendingEntityId == "office-dog" ) {
      return "Toimistokoira heiluttaa häntää ja katsoo sinua odottaen.";
    }
    if ( this.pendingEntityId == "janitor" ) {
      if ( this.tools.hasShedKey ) {
        return "Talkkari nyökkää: \"Vajan avain on jo taskussasi. Kadonnut kulkukortti lienee siellä.\"";
      }
      return "Talkkari pysähtyy harjan kanssa: \"Uusi tulokas? Piha on rauhallinen — toisin kuin sisällä.\"";
    }
    if ( this.pendingEntityId == "receptionist" ) {
      if ( this.interviewPassed ) {
        return "Vastaanottovirkailija hymyilee: \"Tervetuloa työntekijäksi. Kulkulupasi on voimassa.\"";
      }
      if ( this.interviewFailed ) {
        if ( this.tools.hasStolenCard ) {
          return "Vastaanottovirkailija katsoo korttiasi epäillen: \"Hetkinen… tämä numero on raportoitu kadonneeksi. Selitä.\"";
        }
        return "Vastaanottovirkailija: \"Haastattelu ei mennyt läpi. Haluatko yrittää uudelleen?\"";
      }
      return "Vastaanottovirkailija: \"Työhaastatteluun? Yksi C++-kysymys — vastaa oikein niin saat virallisen kulkuluvan.\"";
    }
    if ( this.isHostileEncounter() ) {
      return this.pendingEntityName + " katsoo sinua uhkaavasti. Mitä teet?";
    }
    if ( this.isCeoEncounter() ) {
      return this.pendingEntityName + " pysäyttää sinut: \"Strateginen tilanne. KPI:t eivät odota — mitä haluat?\"";
    }
    if ( this.pendingEntityKind == "security" ) {
      return "Turvallisuus tarkkailee sinua: \"Tunniste näkyvissä? Asiallisuus kunnossa?\"";
    }
    if ( this.pendingEntityKind == "guru" ) {
      if ( this.guruIntroPassed ) {
        return this.pendingEntityName + ": \"Perusteet jo kunnossa. Jatka hissillä ylempiin kerroksiin — paina 3 tai korkeampi numero.\"";
      }
      if ( this.guruStoryAttempted ) {
        return this.pendingEntityName + " haluaa tarkistaa yhden C++-kysymyksen ennen kuin päästää ylemmäs.";
      }
      return this.pendingEntityName + " nostaa katseensa koodista. Miten lähestyt?";
    }
    if ( this.isCoworkerEncounter() ) {
      if ( (this.tools.heldCoworkerCardOwner.length) > 0 ) {
        if ( this.tools.heldCoworkerCardOwner == this.pendingEntityId ) {
          return this.pendingEntityName + " näyttää huolestuneelta: \"Oletko nähnyt kulkukorttiani?\"";
        }
      }
      return this.pendingEntityName + " haluaa kysyä yhden C++-kysymyksen ennen kuin palaat työhön.";
    }
    if ( this.pendingEntityChar == "S" ) {
      return this.pendingEntityName + ": \"Ajanvaraus? Täyttäkää ensin lomake 7B.\"";
    }
    if ( this.pendingEntityChar == "P" ) {
      return this.pendingEntityName + ": \"Oletko päivittänyt riskirekisteriä tällä viikolla?\"";
    }
    return this.pendingEntityName + " huomaa sinut. Mitä teet?";
  };
  encounterAttackWarning () {
    if ( this.isCeoEncounter() ) {
      return " — toimitusjohtajaan hyökkääminen = välitön potku, ellei karmasi ole erittäin korkea!";
    }
    if ( this.isHostileEncounter() ) {
      return " — battle-tilanteessa karma voi kadota pahasti!";
    }
    if ( this.pendingEntityKind == "security" ) {
      return " — turvallisuus vastaa välittömästi!";
    }
    if ( this.isCoworkerEncounter() ) {
      return " — kollega voi huutaa 112: kolme poliisia (P) takaa-ajoon!";
    }
    return "";
  };
  encounterDeath (message) {
    this.ensureEngine();
    this.engine.deaths = this.engine.deaths + 1;
    const floor = this._map.activeFloor();
    this._map.playerX = floor.spawnX;
    this._map.playerY = floor.spawnY;
    this._map.playerHidden = false;
    this._map.ensurePlayerOnWalkable();
    this._map.lastStatus = message + " Heräsit toimiston spawn-pisteellä.";
    this.clearEncounter();
    this.screen = "map";
    this.encounterResult = "death";
  };
  clearEncounter () {
    this.pendingEntityId = "";
    this.pendingEntityChar = "";
    this.pendingEntityName = "";
    this.pendingEntityKind = "";
    this.encounterResult = "";
    this.encounterCooldown = 3;
  };
  startEncounter (bump) {
    this.pendingEntityId = bump.id;
    this.pendingEntityChar = bump.char;
    this.pendingEntityName = bump.name;
    this.pendingEntityKind = bump.kind;
    this.pendingStoryId = bump.storyId;
    this.encounterResult = "";
    this.screen = "encounter";
  };
  loadMapFromText (mapJson) {
    this.ensureEngine();
    const ok = this._map.loadFromText(mapJson);
    if ( ok == false ) {
      this.menuMessage = "Kartan lataus epäonnistui.";
    }
    this.screen = "map";
    this.markStateDirty();
    return ok;
  };
  applySave (featureIds, featureAmounts, deathCount) {
    this.karma.ids = featureIds;
    this.karma.amounts = featureAmounts;
    this.engine.deaths = deathCount;
    this.markStateDirty();
  };
  applyGuruProgress (introPassed, storyAttempted, quizCorrect) {
    this.guruIntroPassed = introPassed;
    this.guruStoryAttempted = storyAttempted;
    this.guruQuizCorrect = quizCorrect;
    this.markStateDirty();
  };
  exportDeaths () {
    return this.engine.deaths;
  };
  onPrisonKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    if ( this.conduct.tickPrison() ) {
      this.screen = "map";
      this._map.lastStatus = "Pääsit vapaaksi. Turvallisuus valvoo yhä.";
    } else {
      this._map.lastStatus = ("Vangittuna — " + ((this.conduct.prisonTurns.toString()))) + " vuoroa jäljellä.";
    }
    this.markStateDirty();
  };
  tryElevatorKey (key) {
    let idx = -1;
    if ( key == "1" ) {
      idx = 0;
    }
    if ( key == "2" ) {
      idx = 1;
    }
    if ( key == "3" ) {
      idx = 2;
    }
    if ( key == "4" ) {
      idx = 3;
    }
    if ( key == "5" ) {
      idx = 4;
    }
    if ( key == "6" ) {
      idx = 5;
    }
    if ( key == "7" ) {
      idx = 6;
    }
    if ( key == "8" ) {
      idx = 7;
    }
    if ( key == "9" ) {
      idx = 8;
    }
    if ( key == "0" ) {
      idx = 9;
    }
    if ( idx >= 0 ) {
      if ( this.canAccessFloor(idx) == false ) {
        this._map.lastStatus = this.elevatorDeniedMessage(idx);
        this.markStateDirty();
        return;
      }
      if ( this._map.tryElevatorTo(idx) ) {
        this.markStateDirty();
      }
    }
  };
  handleAgentTick () {
    if ( this.screen != "map" ) {
      return;
    }
    this.worldClock.advance(1);
    this._map.tickSchedules(this.worldClock.gameMinutes);
    this._map.agentHuntFlag = this.conduct.isWanted();
    const agentResult = this._map.tickAgents();
    if ( (agentResult.id.length) > 0 ) {
      if ( agentResult.kind == "police" ) {
        this.gameOverPolice();
        return;
      }
      if ( agentResult.kind == "security" ) {
        this.conduct.arrest();
        this._map.teleportToPrison();
        this.screen = "prison";
        return;
      }
      if ( this.encounterCooldown > 0 ) {
        this.encounterCooldown = this.encounterCooldown - 1;
        return;
      }
      this._map.lastStatus = agentResult.name + " haluaa jutella.";
      this.startEncounter(agentResult);
    }
  };
  afterPlayerAction () {
    const toolPick = this._map.pickupItemAt(this._map.playerX, this._map.playerY);
    if ( (toolPick.length) > 0 ) {
      this.tools.grant(toolPick);
      if ( toolPick == "coworker_card" ) {
        this.tools.setCoworkerCardOwner(this._map.lastPickedOwner);
      }
      if ( (((toolPick == "crowbar") || (toolPick == "shovel")) || (toolPick == "sledgehammer")) || (toolPick == "usb_drive") ) {
        const toolName = this.tools.activeLabel();
        this._map.lastStatus = "Poimit työkalun: " + toolName;
      } else {
        const itemName = this.tools.pickupLabel(toolPick);
        this._map.lastStatus = ("Poimit: " + itemName) + "  (i = inventaario)";
      }
    }
  };
  tryPlayerMove (dx, dy) {
    if ( dx != 0 ) {
      this._map.facingX = dx;
      this._map.facingY = 0;
    }
    if ( dy != 0 ) {
      this._map.facingX = 0;
      this._map.facingY = dy;
    }
    const nx = this._map.playerX + dx;
    const ny = this._map.playerY + dy;
    const tile = this._map.tileAt(nx, ny);
    if ( tile == "L" ) {
      if ( this.tools.hasBuildingAccess() == false ) {
        this._map.lastStatus = "Pääoven lukko — tarvitset kulkukortin.";
        return false;
      }
      if ( this.tools.hasOfficialBadge == false ) {
        this.usedStolenCardEntry = true;
      }
      this._map.openTileAt(nx, ny);
    }
    if ( tile == "+" ) {
      if ( this.tools.hasShedKey == false ) {
        this._map.lastStatus = "Vajan ovi lukossa. Kysy avain talkkarilta.";
        return false;
      }
      this._map.openTileAt(nx, ny);
    }
    return this._map.tryMove(dx, dy);
  };
  canAccessFloor (floorIndex) {
    if ( floorIndex == 0 ) {
      return true;
    }
    if ( this.tools.hasBuildingAccess() == false ) {
      return false;
    }
    if ( floorIndex == 1 ) {
      return true;
    }
    if ( floorIndex >= 9 ) {
      if ( this.tools.accessTier < 4 ) {
        return false;
      }
      return true;
    }
    if ( floorIndex >= 2 ) {
      if ( this.guruIntroPassed == false ) {
        return false;
      }
      if ( this.tools.accessTier < 3 ) {
        return false;
      }
      return true;
    }
    return false;
  };
  elevatorDeniedMessage (floorIndex) {
    if ( floorIndex >= 9 ) {
      return "10. kerros vaatii virallisen kulkuluvan — varastettu kortti ei riitä.";
    }
    if ( floorIndex >= 2 ) {
      if ( this.guruIntroPassed == false ) {
        return "Ylemmät kerrokset lukittu — läpäise gurun tarkistus (kerros 2).";
      }
      if ( this.tools.accessTier < 3 ) {
        return "Kerrokset 3–9 vaativat ylennyksen — 2 oikeaa vastausta työkavereilta.";
      }
    }
    if ( this.tools.hasBuildingAccess() == false ) {
      return "Hissi vaatii kulkukortin.";
    }
    return "Kulkukorttisi ei kata tätä kerrosta.";
  };
  applyStoryRewards (storyId, outcome) {
    if ( storyId == "courtyard-janitor" ) {
      if ( outcome == "victory" ) {
        this.tools.grant("shed_key");
        this._map.lastStatus = "Talkkari antoi vajan avaimen.";
      }
      return;
    }
    if ( storyId == "lobby-interview" ) {
      if ( outcome == "victory" ) {
        this.tools.grant("official_badge");
        this.interviewPassed = true;
        this.interviewFailed = false;
        this._map.lastStatus = "Sait virallisen kulkuluvan — haastattelu meni läpi!";
      } else {
        this.interviewFailed = true;
        this.interviewPassed = false;
        this._map.lastStatus = "Haastattelu ei mennyt läpi. Voit yrittää varastetulla kortilla — riskillä.";
      }
      return;
    }
    if ( storyId == "stolen-card-caught" ) {
      this.conduct.arrest();
      this._map.teleportToPrison();
      this.screen = "prison";
      return;
    }
    if ( storyId == "modern-cpp-intro" ) {
      if ( outcome == "victory" ) {
        this.guruIntroPassed = true;
        this._map.lastStatus = "Guru hyväksyi perusteet. Hae ylennyskortti työkavereilta — 10. kerros vaatii virallisen luvan.";
      }
    }
  };
  needsCardReturnChoice () {
    if ( (this.tools.heldCoworkerCardOwner.length) < 1 ) {
      return false;
    }
    if ( this.tools.heldCoworkerCardOwner != this.pendingEntityId ) {
      return false;
    }
    return true;
  };
  returnCoworkerCard () {
    const ownerName = this.pendingEntityName;
    this.tools.returnCoworkerCard();
    this.karma.add("social:honest", 8);
    this._map.lastStatus = ("Palautit kortin — " + ownerName) + " kiittää. (+8 karma)";
    this.clearEncounter();
    this.screen = "map";
    this.markStateDirty();
  };
  keepCoworkerCardLie () {
    this.karma.loseKarma(2);
    this._map.lastStatus = "Väitit ettei kortti ole sinulla. Työkaveri epäilee — pidät kortin.";
    this.clearEncounter();
    this.screen = "map";
    this.markStateDirty();
  };
  onReceptionistTalk () {
    if ( this.interviewFailed == false ) {
      if ( this.interviewPassed ) {
        return;
      }
      return;
    }
    if ( this.tools.hasStolenCard == false ) {
      return;
    }
    if ( this.usedStolenCardEntry == false ) {
      return;
    }
    this.pendingStoryId = "stolen-card-caught";
    this.encounterResult = "talk";
  };
  onMapKey (key) {
    if ( this.screen == "prison" ) {
      this.onPrisonKey(key);
      return;
    }
    if ( this.screen == "gameover" ) {
      this.onGameOverKey(key);
      return;
    }
    if ( this.screen == "studylist" ) {
      this.onStudyListKey(key);
      return;
    }
    if ( this.screen == "inventory" ) {
      this.onInventoryKey(key);
      return;
    }
    if ( this.screen != "map" ) {
      return;
    }
    if ( this.conduct.arrested ) {
      this.screen = "prison";
      this.markStateDirty();
      return;
    }
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    if ( key == "?" ) {
      this.screen = "menu";
      this.menuMessage = "";
      this.markStateDirty();
      return;
    }
    if ( key == "b" ) {
      this.screen = "studylist";
      this.markStateDirty();
      return;
    }
    if ( key == "i" ) {
      this.screen = "inventory";
      this.markStateDirty();
      return;
    }
    if ( key == "h" ) {
      if ( this._map.tryToggleHide() ) {
        this.handleAgentTick();
        this.markStateDirty();
      } else {
        this._map.lastStatus = "Piiloudu kopin (=) taakse.";
        this.markStateDirty();
      }
      return;
    }
    if ( key == "t" ) {
      if ( this.tools.hasAny() == false ) {
        this._map.lastStatus = "Ei työkaluja — pihalta löytyy vasara ja kivivasara.";
      } else {
        this.tools.cycleActive();
        const toolName = this.tools.activeLabel();
        this._map.lastStatus = "Työkalu: " + toolName;
      }
      this.markStateDirty();
      return;
    }
    if ( key == "x" ) {
      const severity = this._map.tryBreakFacing(this.tools.activeTool);
      if ( (severity.length) > 0 ) {
        if ( severity == "heavy" ) {
          this.conduct.addDamage(15);
          this.conduct.addMisconduct(10);
        }
        if ( severity == "medium" ) {
          this.conduct.addDamage(6);
          this.conduct.addMisconduct(4);
        }
        if ( severity == "light" ) {
          this.conduct.addDamage(2);
          this.conduct.addMisconduct(1);
        }
        this.afterPlayerAction();
        this.handleAgentTick();
      }
      this.markStateDirty();
      return;
    }
    if ( (((((((((key == "1") || (key == "2")) || (key == "3")) || (key == "4")) || (key == "5")) || (key == "6")) || (key == "7")) || (key == "8")) || (key == "9")) || (key == "0") ) {
      this.tryElevatorKey(key);
      return;
    }
    let dx = 0;
    let dy = 0;
    if ( key == "up" ) {
      dy = -1;
    } else {
      if ( key == "down" ) {
        dy = 1;
      } else {
        if ( key == "left" ) {
          dx = -1;
        } else {
          if ( key == "right" ) {
            dx = 1;
          } else {
            if ( key == "w" ) {
              dy = -1;
            } else {
              if ( key == "s" ) {
                dy = 1;
              } else {
                if ( key == "a" ) {
                  dx = -1;
                } else {
                  if ( key == "d" ) {
                    dx = 1;
                  } else {
                    this._map.lastStatus = "Tuntematon näppäin.";
                    this.markStateDirty();
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }
    const targetX = this._map.playerX + dx;
    const targetY = this._map.playerY + dy;
    const moved = this.tryPlayerMove(dx, dy);
    if ( moved ) {
      if ( this.encounterCooldown > 0 ) {
        this.encounterCooldown = this.encounterCooldown - 1;
      }
      this.afterPlayerAction();
      if ( this.screen != "map" ) {
        this.markStateDirty();
        return;
      }
    } else {
      const blocker = this._map.entityAt(targetX, targetY);
      if ( (blocker.id.length) > 0 ) {
        if ( blocker.kind != "item" ) {
          this._map.playerHidden = false;
          this._map.lastStatus = "";
          this.startEncounter(blocker);
          this.markStateDirty();
          return;
        }
      }
    }
    const bump = this._map.bumpAtPlayer();
    if ( (bump.id.length) > 0 ) {
      this.startEncounter(bump);
    } else {
      if ( moved ) {
        this.handleAgentTick();
      }
    }
    this.markStateDirty();
  };
  onEncounterChoice (choice) {
    if ( this.screen != "encounter" ) {
      return;
    }
    if ( choice == "leave" ) {
      this._map.lastStatus = "Vetäydyt takaisin.";
      this.clearEncounter();
      this.screen = "map";
      this.markStateDirty();
      return;
    }
    if ( choice == "talk" ) {
      if ( this.needsCardReturnChoice() ) {
        this.encounterResult = "card_return";
        this.markStateDirty();
        return;
      }
      if ( this.pendingEntityId == "receptionist" ) {
        if ( this.interviewPassed ) {
          this._map.lastStatus = "Sinulla on jo virallinen kulkulupa. Hissillä pääset kaikkiin kerroksiin, myös 10. kerrokseen (0).";
          this.clearEncounter();
          this.screen = "map";
          this.markStateDirty();
          return;
        }
        this.onReceptionistTalk();
        if ( this.pendingStoryId == "stolen-card-caught" ) {
          this.encounterResult = "talk";
          this.markStateDirty();
          return;
        }
        this.pendingStoryId = "";
        this.encounterResult = "quiz";
        this.markStateDirty();
        return;
      }
      if ( this.pendingEntityKind == "guru" ) {
        if ( this.guruIntroPassed ) {
          this._map.lastStatus = "Senior-guru: \"Olet jo läpäissyt tämän. Jatka hissillä kerrokseen 3 tai ylemmäs.\"";
          this.clearEncounter();
          this.screen = "map";
          this.markStateDirty();
          return;
        }
        this.pendingStoryId = "";
        this.encounterResult = "quiz";
        this.markStateDirty();
        return;
      }
      if ( (this.pendingStoryId.length) < 1 ) {
        if ( this.needsEncounterQuiz() ) {
          this.encounterResult = "quiz";
          this.markStateDirty();
          return;
        }
        this._map.lastStatus = "Ei ole mitään järkevää sanottavaa.";
        this.clearEncounter();
        this.screen = "map";
        this.markStateDirty();
        return;
      }
      this.encounterResult = "talk";
      this.markStateDirty();
      return;
    }
    if ( choice == "attack" ) {
      if ( this.isCeoEncounter() ) {
        const totalKarma = this.karma.total();
        if ( totalKarma < 100 ) {
          this.encounterDeath("YOU ARE FIRED!!!!");
          this.markStateDirty();
          return;
        }
        this.karma.loseKarma(40);
        this.conduct.addMisconduct(25);
        this._map.lastStatus = "Toimitusjohtaja oli valmis potkuihin — korkea karma pelasti sinut. Tällä kertaa.";
        this.encounterResult = "attack";
        this.clearEncounter();
        this.screen = "map";
        this.markStateDirty();
        return;
      }
      if ( this.pendingEntityKind == "security" ) {
        this.karma.loseKarma(20);
        this.conduct.addMisconduct(20);
        this.conduct.arrest();
        this._map.teleportToPrison();
        this._map.lastStatus = "Turvallisuus neutraloi hyökkäyksen.";
        this.encounterResult = "attack";
        this.clearEncounter();
        this.screen = "prison";
        this.markStateDirty();
        return;
      }
      if ( this.isCoworkerEncounter() ) {
        const roll = Math.floor(Math.random()*(2 - 0 + 1) + 0);
        if ( roll == 0 ) {
          this.triggerPoliceChaseAfterAttack(this.pendingEntityName);
          return;
        }
        this.karma.loseKarma(15);
        this.conduct.addMisconduct(15);
        this._map.lastStatus = this.pendingEntityName + " huusi HR:n. Kollegan hyökkääminen ei ole ok.";
        this.encounterResult = "attack";
        this.clearEncounter();
        this.screen = "map";
        this.markStateDirty();
        return;
      }
      const chaseRoll = Math.floor(Math.random()*(2 - 0 + 1) + 0);
      if ( chaseRoll == 0 ) {
        if ( this.isHostileEncounter() ) {
          this.triggerPoliceChaseAfterAttack(this.pendingEntityName);
          return;
        }
      }
      let penalty = 8;
      if ( this.isHostileEncounter() ) {
        penalty = 30;
      }
      this.karma.loseKarma(penalty);
      this.conduct.addMisconduct(12);
      if ( this.isHostileEncounter() ) {
        this.conduct.addMisconduct(8);
        this._map.lastStatus = ("Hyökkäys epäonnistui pahasti. -" + ((penalty.toString()))) + " karmaa.";
      } else {
        this._map.lastStatus = ("Hyökkäys toimistossa ei kannata. -" + ((penalty.toString()))) + " karmaa.";
      }
      this.encounterResult = "attack";
      this.clearEncounter();
      this.screen = "map";
      this.markStateDirty();
      return;
    }
    if ( choice == "joke" ) {
      const roll_1 = Math.floor(Math.random()*(2 - 0 + 1) + 0);
      if ( roll_1 == 0 ) {
        if ( (this.pendingStoryId.length) > 0 ) {
          this._map.lastStatus = "Vitsi laskee jännitteen. Jatketaan jutustelua.";
          this.encounterResult = "talk";
        } else {
          this._map.lastStatus = "Vitsi naurattaa, mutta asia jää auki.";
          this.encounterResult = "joke_ok";
          this.clearEncounter();
          this.screen = "map";
        }
      } else {
        const penalty_1 = 10;
        this.karma.loseKarma(penalty_1);
        this.conduct.addMisconduct(6);
        this._map.lastStatus = ("Vitsi ei mennyt läpi. -" + ((penalty_1.toString()))) + " karmaa.";
        this.encounterResult = "joke_fail";
        this.clearEncounter();
        this.screen = "map";
      }
      this.markStateDirty();
      return;
    }
    this._map.lastStatus = "Valitse 1–4.";
    this.markStateDirty();
  };
  onInventoryKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    this.screen = "map";
    this._map.lastStatus = "Takaisin kartalla.";
    this.markStateDirty();
  };
  getInventoryView () {
    const view = new InventoryView();
    this.tools.fillInventory(view);
    return view;
  };
  onStudyListKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    this.screen = "map";
    this._map.lastStatus = "Takaisin toimistolla.";
    this.markStateDirty();
  };
  onGameOverKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    this._map.clearPoliceSquad();
    const floor = this._map.activeFloor();
    this._map.playerX = floor.spawnX;
    this._map.playerY = floor.spawnY;
    this._map.playerHidden = false;
    this._map.ensurePlayerOnWalkable();
    this._map.lastStatus = "Selvitit hengissä — mutta poliisit muistavat kasvosi.";
    this.screen = "map";
    this.markStateDirty();
  };
  finishEncounterTalk () {
    this.clearEncounter();
    this.encounterResult = "";
    this.markStateDirty();
  };
  clearPendingStory () {
    this.pendingStoryId = "";
    this.markStateDirty();
  };
  beginStory (storyJson) {
    if ( this.engine.loadFromText(storyJson) == false ) {
      this._map.lastStatus = "Tarinan lataus epäonnistui.";
      this.screen = "map";
      this.clearEncounter();
      this.pendingStoryId = "";
      this.markStateDirty();
      return false;
    }
    if ( this.engine.storyId == "modern-cpp-intro" ) {
      this.guruStoryAttempted = true;
    }
    this.pendingStoryId = "";
    this.screen = "story";
    this.markStateDirty();
    return true;
  };
  onStoryNarrativeAdvance () {
    this.engine.advanceNarrative();
    this.syncStoryEnd();
  };
  onStoryChoice (index) {
    this.engine.submitChoice(index);
    this.syncStoryEnd();
  };
  onStoryCodeResult (answer, matches) {
    this.engine.applyCodeResult(answer, matches);
    this.syncStoryEnd();
  };
  onStoryDismissFeedback () {
    this.engine.dismissFeedback();
    this.syncStoryEnd();
  };
  syncStoryEnd () {
    const view = this.engine.getView();
    if ( view.screen == "ended" ) {
      const sid = this.engine.storyId;
      this.applyStoryRewards(sid, view.outcome);
      this.engine.returnToMenu();
      if ( this.screen != "prison" ) {
        this.screen = "map";
      }
      this.clearEncounter();
    }
    this.markStateDirty();
  };
  onMenuPick (raw) {
    if ( raw == "q" ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    if ( raw == "m" ) {
      this.screen = "map";
      this.menuMessage = "";
      this.markStateDirty();
      return;
    }
    if ( (raw.length) == 0 ) {
      this.screen = "map";
      this.menuMessage = "";
      this.markStateDirty();
      return;
    }
    this.menuMessage = "Tuntematon valinta.";
    this.markStateDirty();
  };
  onMenuStartStory (storyJson) {
    this.beginStory(storyJson);
  };
  backToMap () {
    this.screen = "map";
    this.menuMessage = "";
    this.clearEncounter();
    this.markStateDirty();
  };
  getEncounterView () {
    const view = new EncounterView();
    view.entityChar = this.pendingEntityChar;
    view.entityName = this.pendingEntityName;
    view.isHostile = this.isHostileEncounter();
    view.greeting = this.encounterGreeting();
    view.attackWarning = this.encounterAttackWarning();
    if ( this.needsEncounterQuiz() ) {
      view.attackWarning = "";
      view.hintLine = "1–4=vastaa  n=kollega  a=AI  j=vitsi  i=ei kiinnosta  p=poistu  h=hyökkää";
    } else {
      view.hintLine = "1=juttele  2=hyökkää  3=vitsi  4=poistu";
    }
    return view;
  };
  getMapView () {
    const view = this._map.getView();
    const toolName = this.tools.activeLabel();
    const proprietyScore = this.conduct.propriety();
    view.toolsLine = "Työkalu: " + toolName;
    view.conductLine = (("Asiallisuus: " + ((proprietyScore.toString()))) + "  Vahingot: ") + ((this.conduct.propertyDamage.toString()));
    if ( this.conduct.isWanted() ) {
      view.conductLine = view.conductLine + "  |  ETSINTÄKUULUTUS";
    }
    view.timeLine = this.worldClock.formatLine();
    view.ambientLine = this._map.overheardMsg;
    return view;
  };
  getStoryView () {
    return this.engine.getView();
  };
  catalogList () {
    return this.catalog.list();
  };
  findStoryByIndex (index) {
    return this.catalog.findByIndex(index);
  };
  __rangerRegisterRoot () {
    this.__rangerClassName = "GameSession";
    this.__rangerTypeId = 1;
    const __rgrIdReg = ProcessIdRegistry.__singleton();
    const __rgrNewId = __rgrIdReg.allocate();
    this.__rangerId = __rgrNewId;
    (GameSession__Registry.__singleton()).track(this);
  };
  __rangerRegisterChild (parent) {
    this.__rangerClassName = "GameSession";
    this.__rangerTypeId = 1;
    this.__rangerParent = parent;
    this.__rangerParentId = parent.__rangerId;
    const __rgrIdReg = ProcessIdRegistry.__singleton();
    const __rgrNewId = __rgrIdReg.allocate();
    this.__rangerId = __rgrNewId;
    parent.__rangerTrackChild(this);
    (GameSession__Registry.__singleton()).track(this);
  };
  __rangerUnregister () {
    this.__rangerId = 0;
    this.__rangerParentId = 0;
  };
  __rangerInvokeStart () {
    (this).start();
  };
  __rangerStopSubtree () {
    if ( this.__rangerId == 0 ) {
      return;
    }
    let __rgrIdx = 0;
    while (__rgrIdx < (this.__rangerChildren.length)) {
      const __rgrChild = this.__rangerChildren[__rgrIdx];
      __rgrChild.__rangerStopSubtree();
      __rgrIdx = __rgrIdx + 1;
    };
    (GameSession__Registry.__singleton()).untrack(this);
    this.__rangerUnregister();
    this.__rangerClearChildren();
  };
}
GameSession.allInstances = function() {
  const __rgrReg = GameSession__Registry.__singleton();
  return __rgrReg.items;
};
GameSession.tryStopByProcessId = function(processId) {
  const __rgrReg = GameSession__Registry.__singleton();
  for ( let i = 0; i < __rgrReg.items.length; i++) {
    var inst = __rgrReg.items[i];
    if ( inst.__rangerId == processId ) {
      if ( inst.__rangerId != 0 ) {
        inst.__rangerStopSubtree();
        return true;
      }
    }
  };
  return false;
};
GameSession.parentIdOf = function(child) {
  let cur = child.__rangerParent;
  while ((typeof(cur) === "undefined") == false) {
    const node = cur;
    const __rgrExpectType = 1;
    if ( node.__rangerTypeId != __rgrExpectType ) {
      cur = node.__rangerParent;
    } else {
      return node.__rangerId;
    }
  };
  return 0;
};
GameSession.processPath = function() {
  return "app.koodisampo";
};
GameSession.stopAllLive = function() {
  const __rgrReg = GameSession__Registry.__singleton();
  __rgrReg.stopAllInstances();
};
class KoodisampoAppRoot  extends RangerProcessBase {
  constructor() {
    super()
  }
  start () {
  };
  createSession () {
    const session = (() => { const __rgr_proc = new GameSession(); __rgr_proc.__rangerRegisterRoot(); return __rgr_proc; })();
    if ( session.__rangerId == 0 ) {
      session.__rangerRegisterRoot();
    }
    ProcessRuntime.startInstance(session);
    return session;
  };
  __rangerRegisterRoot () {
    this.__rangerClassName = "KoodisampoAppRoot";
    this.__rangerTypeId = 2;
    const __rgrIdReg = ProcessIdRegistry.__singleton();
    const __rgrNewId = __rgrIdReg.allocate();
    this.__rangerId = __rgrNewId;
    (KoodisampoAppRoot__Registry.__singleton()).track(this);
  };
  __rangerRegisterChild (parent) {
    this.__rangerClassName = "KoodisampoAppRoot";
    this.__rangerTypeId = 2;
    this.__rangerParent = parent;
    this.__rangerParentId = parent.__rangerId;
    const __rgrIdReg = ProcessIdRegistry.__singleton();
    const __rgrNewId = __rgrIdReg.allocate();
    this.__rangerId = __rgrNewId;
    parent.__rangerTrackChild(this);
    (KoodisampoAppRoot__Registry.__singleton()).track(this);
  };
  __rangerUnregister () {
    this.__rangerId = 0;
    this.__rangerParentId = 0;
  };
  __rangerInvokeStart () {
    (this).start();
  };
  __rangerStopSubtree () {
    if ( this.__rangerId == 0 ) {
      return;
    }
    let __rgrIdx = 0;
    while (__rgrIdx < (this.__rangerChildren.length)) {
      const __rgrChild = this.__rangerChildren[__rgrIdx];
      __rgrChild.__rangerStopSubtree();
      __rgrIdx = __rgrIdx + 1;
    };
    (KoodisampoAppRoot__Registry.__singleton()).untrack(this);
    this.__rangerUnregister();
    this.__rangerClearChildren();
  };
}
KoodisampoAppRoot.allInstances = function() {
  const __rgrReg = KoodisampoAppRoot__Registry.__singleton();
  return __rgrReg.items;
};
KoodisampoAppRoot.tryStopByProcessId = function(processId) {
  const __rgrReg = KoodisampoAppRoot__Registry.__singleton();
  for ( let i = 0; i < __rgrReg.items.length; i++) {
    var inst = __rgrReg.items[i];
    if ( inst.__rangerId == processId ) {
      if ( inst.__rangerId != 0 ) {
        inst.__rangerStopSubtree();
        return true;
      }
    }
  };
  return false;
};
KoodisampoAppRoot.parentIdOf = function(child) {
  let cur = child.__rangerParent;
  while ((typeof(cur) === "undefined") == false) {
    const node = cur;
    const __rgrExpectType = 2;
    if ( node.__rangerTypeId != __rgrExpectType ) {
      cur = node.__rangerParent;
    } else {
      return node.__rangerId;
    }
  };
  return 0;
};
KoodisampoAppRoot.processPath = function() {
  return "app.koodisampo.root";
};
KoodisampoAppRoot.stopAllLive = function() {
  const __rgrReg = KoodisampoAppRoot__Registry.__singleton();
  __rgrReg.stopAllInstances();
};
class KoodisampoLib  {
  constructor() {
  }
}
class GameSession__Registry  {
  constructor() {
    if (GameSession__Registry.__singleton_instance != null) {
      return GameSession__Registry.__singleton_instance;
    }
    this.items = [];
    GameSession__Registry.__singleton_instance = this;
  }
  track (inst) {
    this.items.push(inst);
  };
  untrack (inst) {
    let kept = [];
    for ( let i = 0; i < this.items.length; i++) {
      var x = this.items[i];
      if ( x.__rangerId != inst.__rangerId ) {
        kept.push(x);
      }
    };
    this.items = kept;
  };
  all () {
    return this.items;
  };
  stopAllInstances () {
    const n = this.items.length;
    let i = n - 1;
    while (i >= 0) {
      const inst = this.items[i];
      if ( inst.__rangerId != 0 ) {
        inst.__rangerStopSubtree();
      }
      i = i - 1;
    };
  };
}
GameSession__Registry.__singleton_instance = null;
GameSession__Registry.__singleton = function() {
  if (GameSession__Registry.__singleton_instance == null) {
    GameSession__Registry.__singleton_instance = new GameSession__Registry();
  }
  return GameSession__Registry.__singleton_instance;
};
class KoodisampoAppRoot__Registry  {
  constructor() {
    if (KoodisampoAppRoot__Registry.__singleton_instance != null) {
      return KoodisampoAppRoot__Registry.__singleton_instance;
    }
    this.items = [];
    KoodisampoAppRoot__Registry.__singleton_instance = this;
  }
  track (inst) {
    this.items.push(inst);
  };
  untrack (inst) {
    let kept = [];
    for ( let i = 0; i < this.items.length; i++) {
      var x = this.items[i];
      if ( x.__rangerId != inst.__rangerId ) {
        kept.push(x);
      }
    };
    this.items = kept;
  };
  all () {
    return this.items;
  };
  stopAllInstances () {
    const n = this.items.length;
    let i = n - 1;
    while (i >= 0) {
      const inst = this.items[i];
      if ( inst.__rangerId != 0 ) {
        inst.__rangerStopSubtree();
      }
      i = i - 1;
    };
  };
}
KoodisampoAppRoot__Registry.__singleton_instance = null;
KoodisampoAppRoot__Registry.__singleton = function() {
  if (KoodisampoAppRoot__Registry.__singleton_instance == null) {
    KoodisampoAppRoot__Registry.__singleton_instance = new KoodisampoAppRoot__Registry();
  }
  return KoodisampoAppRoot__Registry.__singleton_instance;
};
module.exports.RangerProcessBase = RangerProcessBase;
module.exports.ProcessIdRegistry = ProcessIdRegistry;
module.exports.ProcessNameRegistry = ProcessNameRegistry;
module.exports.ProcessUiHost = ProcessUiHost;
module.exports.ProcessRuntime = ProcessRuntime;
module.exports.RangerFieldDescriptor = RangerFieldDescriptor;
module.exports.RangerClassDescriptor = RangerClassDescriptor;
module.exports.ProcessTreeView = ProcessTreeView;
module.exports.FeatureKarma = FeatureKarma;
module.exports.StorySummary = StorySummary;
module.exports.StoryView = StoryView;
module.exports.StoryCatalog = StoryCatalog;
module.exports.StoryJson = StoryJson;
module.exports.StoryEngine = StoryEngine;
module.exports.MapEntity = MapEntity;
module.exports.EncounterView = EncounterView;
module.exports.MapFloor = MapFloor;
module.exports.MapView = MapView;
module.exports.WorldMap = WorldMap;
module.exports.PlayerConduct = PlayerConduct;
module.exports.PlayerTools = PlayerTools;
module.exports.InventoryView = InventoryView;
module.exports.WorldClock = WorldClock;
module.exports.GameSession = GameSession;
module.exports.KoodisampoAppRoot = KoodisampoAppRoot;
module.exports.KoodisampoLib = KoodisampoLib;
module.exports.GameSession__Registry = GameSession__Registry;
module.exports.KoodisampoAppRoot__Registry = KoodisampoAppRoot__Registry;
