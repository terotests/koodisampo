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
    this.mainTask = "working";
    this.overlayEmotion = "none";
    this.romanticPreference = "any";
    this.offDuty = false;
    this.actionId = "";
    this.greetCooldownUntil = 0;
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
    this.isEmotional = false;
    this.emotionalQuestion = "";
    this.emotionalAnswers = [];
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
    this.needsLine = "";
  }
}
class NpcRelation  {
  constructor() {
    this.friendliness = 50;
    this.respect = 50;
    this.love = 0;
    this.anger = 0;
    this.jealousy = 0;
    this.fear = 0;
    this.suspicion = 0;
    this.followTendency = 50;
    this.panic = 0;
    this.stress = 0;
    this.embarrassment = 0;
    this.greetCount = 0;
    this.snubCount = 0;
  }
  resetDefaults () {
    this.friendliness = 50;
    this.respect = 50;
    this.love = 0;
    this.anger = 0;
    this.jealousy = 0;
    this.fear = 0;
    this.suspicion = 0;
    this.followTendency = 50;
    this.panic = 0;
    this.stress = 0;
    this.embarrassment = 0;
    this.greetCount = 0;
    this.snubCount = 0;
  };
  clampRelation (value) {
    if ( value < 0 ) {
      return 0;
    }
    if ( value > 100 ) {
      return 100;
    }
    return value;
  };
  clampMood (value) {
    if ( value < 0 ) {
      return 0;
    }
    if ( value > 100 ) {
      return 100;
    }
    return value;
  };
  isPanicHigh () {
    if ( this.panic >= 50 ) {
      return true;
    }
    return false;
  };
  isPanicSevere () {
    if ( this.panic >= 75 ) {
      return true;
    }
    return false;
  };
  isAngryNoticeable () {
    if ( this.anger >= 50 ) {
      return true;
    }
    return false;
  };
  isAngryStrong () {
    if ( this.anger >= 60 ) {
      return true;
    }
    return false;
  };
  isAngrySevere () {
    if ( this.anger >= 70 ) {
      return true;
    }
    return false;
  };
  isLoveStrong () {
    if ( this.love >= 70 ) {
      return true;
    }
    return false;
  };
  isLoveModerate () {
    if ( this.love >= 60 ) {
      return true;
    }
    return false;
  };
  isLoveNoticeable () {
    if ( this.love >= 50 ) {
      return true;
    }
    return false;
  };
  isFriendlinessWarm () {
    if ( this.friendliness >= 70 ) {
      return true;
    }
    return false;
  };
  isFriendlinessCold () {
    if ( this.friendliness <= 30 ) {
      return true;
    }
    return false;
  };
  isRespectHigh () {
    if ( this.respect >= 70 ) {
      return true;
    }
    return false;
  };
  isRespectLow () {
    if ( this.respect <= 30 ) {
      return true;
    }
    return false;
  };
  isJealousyHigh () {
    if ( this.jealousy >= 60 ) {
      return true;
    }
    return false;
  };
  isJealousySevere () {
    if ( this.jealousy >= 75 ) {
      return true;
    }
    return false;
  };
  isFearHigh () {
    if ( this.fear >= 60 ) {
      return true;
    }
    return false;
  };
  firedAngerThreshold () {
    return 75;
  };
  statValue (stat) {
    if ( stat == "friendliness" ) {
      return this.friendliness;
    }
    if ( stat == "respect" ) {
      return this.respect;
    }
    if ( stat == "love" ) {
      return this.love;
    }
    if ( stat == "anger" ) {
      return this.anger;
    }
    if ( stat == "jealousy" ) {
      return this.jealousy;
    }
    if ( stat == "fear" ) {
      return this.fear;
    }
    if ( stat == "suspicion" ) {
      return this.suspicion;
    }
    if ( stat == "followTendency" ) {
      return this.followTendency;
    }
    if ( stat == "panic" ) {
      return this.panic;
    }
    if ( stat == "stress" ) {
      return this.stress;
    }
    if ( stat == "embarrassment" ) {
      return this.embarrassment;
    }
    return 50;
  };
  setStat (stat, value) {
    if ( stat == "friendliness" ) {
      this.friendliness = this.clampRelation(value);
      return;
    }
    if ( stat == "respect" ) {
      this.respect = this.clampRelation(value);
      return;
    }
    if ( stat == "love" ) {
      this.love = this.clampRelation(value);
      return;
    }
    if ( stat == "anger" ) {
      this.anger = this.clampRelation(value);
      return;
    }
    if ( stat == "jealousy" ) {
      this.jealousy = this.clampRelation(value);
      return;
    }
    if ( stat == "fear" ) {
      this.fear = this.clampRelation(value);
      return;
    }
    if ( stat == "suspicion" ) {
      this.suspicion = this.clampRelation(value);
      return;
    }
    if ( stat == "followTendency" ) {
      this.followTendency = this.clampRelation(value);
      return;
    }
    if ( stat == "panic" ) {
      this.panic = this.clampMood(value);
      return;
    }
    if ( stat == "stress" ) {
      this.stress = this.clampMood(value);
      return;
    }
    if ( stat == "embarrassment" ) {
      this.embarrassment = this.clampMood(value);
    }
  };
  applyStatDelta (stat, delta) {
    const cur = this.statValue(stat);
    this.setStat(stat, cur + delta);
  };
  matchesAngerBand (minAnger, maxAnger) {
    if ( this.anger < minAnger ) {
      return false;
    }
    if ( this.anger > maxAnger ) {
      return false;
    }
    return true;
  };
  matchesLoveBand (minLove, maxLove) {
    if ( this.love < minLove ) {
      return false;
    }
    if ( this.love > maxLove ) {
      return false;
    }
    return true;
  };
}
class WorldEvent  {
  constructor() {
    this.type = "";
    this.floor = 0;
    this.x = 0;
    this.y = 0;
    this.timeMinutes = 0;
    this.noise = 0;
    this.visibility = 0;
    this.severity = 0;
    this.suspiciousness = 0;
    this.playerSource = true;
  }
  applyWallBrokenHeavy () {
    this.type = "WallBroken";
    this.noise = 18;
    this.visibility = 12;
    this.severity = 16;
    this.suspiciousness = 20;
  };
  applyWallBrokenMedium () {
    this.type = "WallBroken";
    this.noise = 12;
    this.visibility = 8;
    this.severity = 10;
    this.suspiciousness = 12;
  };
  applyWallBrokenLight () {
    this.type = "WallBroken";
    this.noise = 6;
    this.visibility = 4;
    this.severity = 4;
    this.suspiciousness = 6;
  };
  applyDoorBroken () {
    this.type = "DoorBroken";
    this.noise = 14;
    this.visibility = 10;
    this.severity = 12;
    this.suspiciousness = 16;
  };
  applyComputerBroken () {
    this.type = "ComputerBroken";
    this.noise = 4;
    this.visibility = 16;
    this.severity = 14;
    this.suspiciousness = 18;
  };
  applyToiletBroken () {
    this.type = "ToiletBroken";
    this.noise = 10;
    this.visibility = 8;
    this.severity = 8;
    this.suspiciousness = 10;
  };
  applyPlayerFarted () {
    this.type = "PlayerFarted";
    this.noise = 8;
    this.visibility = 6;
    this.severity = 4;
    this.suspiciousness = 6;
  };
  applyWorkplacePanic () {
    this.type = "WorkplacePanic";
    this.noise = 12;
    this.visibility = 14;
    this.severity = 18;
    this.suspiciousness = 10;
    this.playerSource = false;
  };
  applyAngryGroupComplaint () {
    this.type = "AngryGroupComplaint";
    this.noise = 10;
    this.visibility = 8;
    this.severity = 14;
    this.suspiciousness = 12;
    this.playerSource = false;
  };
  applyGossipStarted () {
    this.type = "GossipStarted";
    this.noise = 4;
    this.visibility = 10;
    this.severity = 6;
    this.suspiciousness = 8;
    this.playerSource = false;
  };
  applyPraisePlayer () {
    this.type = "PraisePlayer";
    this.noise = 3;
    this.visibility = 8;
    this.severity = 2;
    this.suspiciousness = 0;
    this.playerSource = false;
  };
}
class WorldEventLog  {
  constructor() {
    this.events = [];
    let empty_3 = [];
    this.events = empty_3;
  }
  reset () {
    let empty = [];
    this.events = empty;
  };
  count () {
    return this.events.length;
  };
  at (index) {
    if ( index < 0 ) {
      const blank = new WorldEvent();
      return blank;
    }
    if ( index >= (this.events.length) ) {
      const blank2 = new WorldEvent();
      return blank2;
    }
    return this.events[index];
  };
  push (evt) {
    this.events.push(evt);
    this.trimTo(32);
  };
  trimTo (maxSize) {
    const n = this.events.length;
    if ( n <= maxSize ) {
      return;
    }
    let trimmed = [];
    const start = n - maxSize;
    let i = start;
    while (i < n) {
      trimmed.push(this.events[i]);
      i = i + 1;
    };
    this.events = trimmed;
  };
  countOnFloor (floor) {
    let c = 0;
    let i = 0;
    const n = this.events.length;
    while (i < n) {
      const e = this.events[i];
      if ( e.floor == floor ) {
        c = c + 1;
      }
      i = i + 1;
    };
    return c;
  };
  lastOnFloor (floor) {
    const blank = new WorldEvent();
    let i = this.events.length;
    while (i > 0) {
      i = i - 1;
      const e = this.events[i];
      if ( e.floor == floor ) {
        return e;
      }
    };
    return blank;
  };
  countOnFloorSince (floor, sinceMinutes, nowMinutes) {
    let c = 0;
    let i = 0;
    const n = this.events.length;
    while (i < n) {
      const e = this.events[i];
      if ( e.floor == floor ) {
        const age = nowMinutes - e.timeMinutes;
        if ( age >= 0 ) {
          if ( age <= sinceMinutes ) {
            c = c + 1;
          }
        }
      }
      i = i + 1;
    };
    return c;
  };
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
    this.leaveTargetX = 0;
    this.leaveTargetY = 0;
    this.navStepDx = 0;
    this.navStepDy = 0;
    this.lastBrokenTile = "";
    this.playerWasWitnessed = false;
    this.json = new StoryJson();
    this.eventLog = new WorldEventLog();
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
      if ( ch == "#" ) {
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
      ent.romanticPreference = this.json.objFieldStr(entObj, "romanticPreference");
      if ( (ent.romanticPreference.length) < 1 ) {
        ent.romanticPreference = "any";
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
    if ( this.entityBlocksPlayer(blocker) ) {
      this.lastStatus = "Tiellä on joku.";
      return false;
    }
    this.playerHidden = false;
    this.playerX = nx;
    this.playerY = ny;
    if ( this.isOnElevator() ) {
      this.lastStatus = "Hissi — 1-9/0 vaihtaa kerrosta.";
    }
    return true;
  };
  emojiStepMessage (x, y) {
    const e = this.entityAt(x, y);
    if ( (e.id.length) < 1 ) {
      return "";
    }
    return this.emojiFeelingForEntity(e);
  };
  emojiFeelingForEntity (ent) {
    if ( ent.kind == "security" ) {
      return "";
    }
    if ( ent.kind == "hostile" ) {
      return "";
    }
    if ( ent.kind == "police" ) {
      return "";
    }
    if ( (ent.itemTool.length) > 0 ) {
      return "";
    }
    const ch = ent.char;
    if ( ch == "🚽" ) {
      return "Tunnet olosi helpottuneeksi.";
    }
    if ( ch == "☕" ) {
      return "Kahvin tuoksu piristää hetkeksi.";
    }
    if ( ch == "💻" ) {
      return "Ruutu houkuttelee sähköpostiin.";
    }
    if ( ch == "🖥️" ) {
      return "Työpöytä odottaa — yksi välilehti liikaa.";
    }
    if ( ch == "🗄️" ) {
      return "Palvelinhallista humisee rauhoittavasti.";
    }
    if ( ch == "📚" ) {
      return "Muistat jotain tärkeää oppikirjasta.";
    }
    if ( ch == "🖨️" ) {
      return "Tulostin yskäisee vanhaa paperia.";
    }
    if ( ch == "📱" ) {
      return "Puhelin värisee taskussasi muistutuksena.";
    }
    if ( ch == "📶" ) {
      return "Yhteys tuntuu hetken luotettavalta.";
    }
    if ( ch == "👥" ) {
      return "Tunnet hiljaisen paniikin ennen kokousta.";
    }
    if ( ch == "🧑‍💻" ) {
      return "Koodari-energia väreilee ilmassa.";
    }
    if ( ch == "💼" ) {
      return "Salkku muistuttaa vastuista.";
    }
    if ( ch == "🏢" ) {
      return "Toimiston betoni tuntuu tutulta.";
    }
    if ( ch == "🛗" ) {
      return "Hissi humisee odottaen seuraavaa kerrosta.";
    }
    if ( ch == "🚪" ) {
      return "Kynnyksen takana voisi olla jotain uutta.";
    }
    if ( ch == "🔒" ) {
      return "Lukko tuntuu turvalliselta — tai turhauttavalta.";
    }
    if ( ch == "📊" ) {
      return "Raportti lupaa selityksen kaikkeen.";
    }
    if ( ch == "📝" ) {
      return "Muistilapun reunat kertovat kiireestä.";
    }
    if ( ch == "🗂️" ) {
      return "Arkistokaapit tuoksuvat vanhalle paperille.";
    }
    if ( ch == "🍱" ) {
      return "Vatsa asettuu hetkeksi.";
    }
    if ( ch == "📠" ) {
      return "Faksi muistuttaa menneitä aikoja.";
    }
    if ( ch == "♻️" ) {
      return "Kierrätys tuntuu pieneltä hyvältä teolta.";
    }
    return "";
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
  isConsumableItemEntity (e) {
    if ( (e.id.length) < 1 ) {
      return false;
    }
    if ( e.kind != "item" ) {
      return false;
    }
    if ( (e.itemTool.length) > 0 ) {
      return false;
    }
    const id = e.id;
    if ( (id.length) >= 18 ) {
      const coffeeTag = id.substring(7, 18 );
      if ( coffeeTag == "emoji-coffee" ) {
        return true;
      }
    }
    if ( (id.length) >= 17 ) {
      const lunchTag = id.substring(7, 17 );
      if ( lunchTag == "emoji-lunch" ) {
        return true;
      }
    }
    const ch = e.char;
    if ( ch == "☕" ) {
      return true;
    }
    if ( ch == "🍱" ) {
      return true;
    }
    return false;
  };
  consumeItemAt (x, y) {
    const e = this.entityAt(x, y);
    if ( this.isConsumableItemEntity(e) == false ) {
      return false;
    }
    this.removeEntityAt(x, y);
    return true;
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
  recordBreakEvent (x, y, tile, severity, timeMinutes) {
    const evt = new WorldEvent();
    evt.floor = this.currentFloor;
    evt.x = x;
    evt.y = y;
    evt.timeMinutes = timeMinutes;
    evt.playerSource = true;
    if ( tile == "L" ) {
      evt.applyDoorBroken();
    } else {
      if ( tile == "+" ) {
        evt.applyDoorBroken();
      } else {
        if ( severity == "heavy" ) {
          evt.applyWallBrokenHeavy();
        } else {
          if ( severity == "medium" ) {
            evt.applyWallBrokenMedium();
          } else {
            evt.applyWallBrokenLight();
          }
        }
      }
    }
    (this.eventLog).push(evt);
  };
  pushWorldEvent (evt) {
    (this.eventLog).push(evt);
  };
  tryBreakAt (x, y, tool, timeMinutes) {
    if ( (tool.length) < 1 ) {
      this.lastStatus = "Ei valittua työkalua (t vaihtaa).";
      return "";
    }
    const tile = this.tileAt(x, y);
    if ( this.isBreakableTile(tile, tool) == false ) {
      this.lastStatus = "Työkalu ei tepsi tähän esteeseen.";
      return "";
    }
    this.lastBrokenTile = tile;
    this.setTileAt(x, y, ".");
    let severity = "";
    if ( tool == "sledgehammer" ) {
      this.lastStatus = "Moukarivasara murskaa seinän — melu kantautuu!";
      severity = "heavy";
    } else {
      if ( tool == "crowbar" ) {
        this.lastStatus = "Sorkkarauta taivuttaa esteen.";
        severity = "medium";
      } else {
        this.lastStatus = "Lapio avaa raon hiljaa.";
        severity = "light";
      }
    }
    if ( timeMinutes >= 0 ) {
      this.recordBreakEvent(x, y, tile, severity, timeMinutes);
    }
    return severity;
  };
  tryBreakFacing (tool, timeMinutes) {
    const fx = this.facingX;
    let fy = this.facingY;
    if ( fx == 0 ) {
      if ( fy == 0 ) {
        fy = 1;
      }
    }
    const tx = this.playerX + fx;
    const ty = this.playerY + fy;
    return this.tryBreakAt(tx, ty, tool, timeMinutes);
  };
  hasRecentLoudEventNear (radius, nowMinutes, maxAge, minNoise) {
    let i = 0;
    const n = (this.eventLog).count();
    while (i < n) {
      const evt = (this.eventLog).at(i);
      if ( evt.floor == this.currentFloor ) {
        if ( evt.noise >= minNoise ) {
          const age = nowMinutes - evt.timeMinutes;
          if ( age >= 0 ) {
            if ( age <= maxAge ) {
              let dx = evt.x - this.playerX;
              if ( dx < 0 ) {
                dx = 0 - dx;
              }
              let dy = evt.y - this.playerY;
              if ( dy < 0 ) {
                dy = 0 - dy;
              }
              if ( (dx + dy) <= radius ) {
                return true;
              }
            }
          }
        }
      }
      i = i + 1;
    };
    return false;
  };
  hasNearbyWitness (radius, nowMinutes) {
    if ( this.playerWasWitnessed ) {
      return true;
    }
    if ( this.hasRecentLoudEventNear(radius, nowMinutes, 3, 12) ) {
      return true;
    }
    const floor = this.activeFloor();
    const ents = floor.entities;
    let i = 0;
    const n = ents.length;
    while (i < n) {
      const e = ents[i];
      if ( e.offDuty == false ) {
        if ( e.kind == "coworker" ) {
          let dx = e.x - this.playerX;
          if ( dx < 0 ) {
            dx = 0 - dx;
          }
          let dy = e.y - this.playerY;
          if ( dy < 0 ) {
            dy = 0 - dy;
          }
          if ( (dx + dy) > 0 ) {
            if ( (dx + dy) <= radius ) {
              return true;
            }
          }
        }
        if ( e.kind == "role" ) {
          let dx2 = e.x - this.playerX;
          if ( dx2 < 0 ) {
            dx2 = 0 - dx2;
          }
          let dy2 = e.y - this.playerY;
          if ( dy2 < 0 ) {
            dy2 = 0 - dy2;
          }
          if ( (dx2 + dy2) > 0 ) {
            if ( (dx2 + dy2) <= radius ) {
              return true;
            }
          }
        }
        if ( e.kind == "security" ) {
          let dx3 = e.x - this.playerX;
          if ( dx3 < 0 ) {
            dx3 = 0 - dx3;
          }
          let dy3 = e.y - this.playerY;
          if ( dy3 < 0 ) {
            dy3 = 0 - dy3;
          }
          if ( (dx3 + dy3) > 0 ) {
            if ( (dx3 + dy3) <= radius ) {
              return true;
            }
          }
        }
        if ( e.kind == "guru" ) {
          let dx4 = e.x - this.playerX;
          if ( dx4 < 0 ) {
            dx4 = 0 - dx4;
          }
          let dy4 = e.y - this.playerY;
          if ( dy4 < 0 ) {
            dy4 = 0 - dy4;
          }
          if ( (dx4 + dy4) > 0 ) {
            if ( (dx4 + dy4) <= radius ) {
              return true;
            }
          }
        }
      }
      i = i + 1;
    };
    return false;
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
  hasLineOfSight (x0, y0, x1, y1) {
    if ( x0 == x1 ) {
      if ( y0 == y1 ) {
        return true;
      }
    }
    let x = x0;
    let y = y0;
    const dx = x1 - x0;
    let adx = dx;
    if ( adx < 0 ) {
      adx = 0 - adx;
    }
    const dy = y1 - y0;
    let ady = dy;
    if ( ady < 0 ) {
      ady = 0 - ady;
    }
    let sx = 1;
    if ( x0 > x1 ) {
      sx = -1;
    }
    let sy = 1;
    if ( y0 > y1 ) {
      sy = -1;
    }
    let err = adx - ady;
    const done = false;
    while (done == false) {
      let atStart = false;
      if ( x == x0 ) {
        if ( y == y0 ) {
          atStart = true;
        }
      }
      let atEnd = false;
      if ( x == x1 ) {
        if ( y == y1 ) {
          atEnd = true;
        }
      }
      if ( atStart == false ) {
        if ( atEnd ) {
          return true;
        }
        const ch = this.tileAt(x, y);
        if ( this.isBlockedTile(ch) ) {
          return false;
        }
      }
      if ( atEnd ) {
        return true;
      }
      const e2 = 2 * err;
      if ( e2 > (0 - ady) ) {
        err = err - ady;
        x = x + sx;
      }
      if ( e2 < adx ) {
        err = err + adx;
        y = y + sy;
      }
    };
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
  entityBlocksPlayer (e) {
    if ( (e.id.length) < 1 ) {
      return false;
    }
    if ( e.kind == "item" ) {
      return false;
    }
    if ( e.offDuty ) {
      return false;
    }
    return true;
  };
  stepTowardPlayer (e) {
    this.stepBestToward(e, this.playerX, this.playerY);
  };
  manhattanTo (x, y, tx, ty) {
    let dx = x - tx;
    if ( dx < 0 ) {
      dx = 0 - dx;
    }
    let dy = y - ty;
    if ( dy < 0 ) {
      dy = 0 - dy;
    }
    return dx + dy;
  };
  canEntityStepTo (e, nx, ny, allowLeavingPeers) {
    if ( nx < 0 ) {
      return false;
    }
    if ( ny < 0 ) {
      return false;
    }
    if ( nx >= this.width ) {
      return false;
    }
    if ( ny >= this.height ) {
      return false;
    }
    const tile = this.tileAt(nx, ny);
    if ( this.isBlockedTile(tile) ) {
      return false;
    }
    const other = this.entityAt(nx, ny);
    if ( (other.id.length) > 0 ) {
      if ( other.kind != "item" ) {
        if ( other.id != e.id ) {
          if ( allowLeavingPeers ) {
            if ( other.npcState != "leaving" ) {
              if ( other.npcState != "at_elevator" ) {
                return false;
              }
            }
          } else {
            return false;
          }
        }
      }
    }
    return true;
  };
  cellIndex (x, y) {
    return (y * this.width) + x;
  };
  indexX (idx) {
    const row = Math.floor( (idx / this.width));
    return idx - (row * this.width);
  };
  indexY (idx) {
    return Math.floor( (idx / this.width));
  };
  isDiscovered (cells, idx) {
    let i = 0;
    const n = cells.length;
    while (i < n) {
      if ( (cells[i]) == idx ) {
        return true;
      }
      i = i + 1;
    };
    return false;
  };
  parentOfCell (cells, parents, idx) {
    let i = 0;
    const n = cells.length;
    while (i < n) {
      if ( (cells[i]) == idx ) {
        return parents[i];
      }
      i = i + 1;
    };
    return -1;
  };
  tryBfsStep (e, tx, ty, allowLeavingPeers) {
    const startIdx = this.cellIndex(e.x, e.y);
    const goalIdx = this.cellIndex(tx, ty);
    if ( startIdx == goalIdx ) {
      return false;
    }
    let queue = [];
    let discCells = [];
    let discParent = [];
    queue.push(startIdx);
    discCells.push(startIdx);
    discParent.push(-1);
    let head = 0;
    let found = false;
    while (head < (queue.length)) {
      const cur = queue[head];
      head = head + 1;
      if ( cur == goalIdx ) {
        found = true;
        break;
      }
      const cx = this.indexX(cur);
      const cy = this.indexY(cur);
      let dir = 0;
      while (dir < 4) {
        let tdx = 0;
        let tdy = 0;
        if ( dir == 0 ) {
          tdx = 0;
          tdy = -1;
        }
        if ( dir == 1 ) {
          tdx = 0;
          tdy = 1;
        }
        if ( dir == 2 ) {
          tdx = -1;
          tdy = 0;
        }
        if ( dir == 3 ) {
          tdx = 1;
          tdy = 0;
        }
        const nx = cx + tdx;
        const ny = cy + tdy;
        if ( this.canEntityStepTo(e, nx, ny, allowLeavingPeers) ) {
          const ni = this.cellIndex(nx, ny);
          if ( this.isDiscovered(discCells, ni) == false ) {
            queue.push(ni);
            discCells.push(ni);
            discParent.push(cur);
          }
        }
        dir = dir + 1;
      };
    };
    if ( found == false ) {
      return false;
    }
    let walk = goalIdx;
    let prev = this.parentOfCell(discCells, discParent, walk);
    while (prev != startIdx) {
      if ( prev < 0 ) {
        return false;
      }
      walk = prev;
      prev = this.parentOfCell(discCells, discParent, walk);
    };
    const sx = this.indexX(walk);
    const sy = this.indexY(walk);
    this.navStepDx = sx - e.x;
    this.navStepDy = sy - e.y;
    return true;
  };
  stepBestToward (e, tx, ty) {
    if ( e.x == tx ) {
      if ( e.y == ty ) {
        return;
      }
    }
    let allowPeers = false;
    if ( e.npcState == "leaving" ) {
      allowPeers = true;
    }
    if ( this.tryBfsStep(e, tx, ty, allowPeers) ) {
      if ( this.canEntityStepTo(e, (e.x + this.navStepDx), (e.y + this.navStepDy), allowPeers) ) {
        this.tryMoveEntity(e, this.navStepDx, this.navStepDy);
        return;
      }
    }
    const ex = e.x;
    const ey = e.y;
    const curDist = this.manhattanTo(ex, ey, tx, ty);
    let pdx = 0;
    let pdy = 0;
    if ( ex < tx ) {
      pdx = 1;
    }
    if ( ex > tx ) {
      pdx = -1;
    }
    if ( pdx == 0 ) {
      if ( ey < ty ) {
        pdy = 1;
      }
      if ( ey > ty ) {
        pdy = -1;
      }
    }
    if ( pdx != 0 ) {
      if ( pdy != 0 ) {
        const pick = Math.floor(Math.random()*(1 - 0 + 1) + 0);
        if ( pick == 0 ) {
          pdy = 0;
        }
        if ( pick == 1 ) {
          pdx = 0;
        }
      }
    }
    if ( pdx != 0 ) {
      if ( this.canEntityStepTo(e, (ex + pdx), (ey + pdy), allowPeers) ) {
        const nd = this.manhattanTo((ex + pdx), (ey + pdy), tx, ty);
        if ( nd < curDist ) {
          this.tryMoveEntity(e, pdx, pdy);
          return;
        }
      }
    }
    if ( pdy != 0 ) {
      if ( this.canEntityStepTo(e, (ex + pdx), (ey + pdy), allowPeers) ) {
        const nd2 = this.manhattanTo((ex + pdx), (ey + pdy), tx, ty);
        if ( nd2 < curDist ) {
          this.tryMoveEntity(e, pdx, pdy);
          return;
        }
      }
    }
    let bestDx = 0;
    let bestDy = 0;
    let bestDist = curDist;
    let found = false;
    let dir = 0;
    while (dir < 4) {
      let tdx = 0;
      let tdy = 0;
      if ( dir == 0 ) {
        tdx = 0;
        tdy = -1;
      }
      if ( dir == 1 ) {
        tdx = 0;
        tdy = 1;
      }
      if ( dir == 2 ) {
        tdx = -1;
        tdy = 0;
      }
      if ( dir == 3 ) {
        tdx = 1;
        tdy = 0;
      }
      const nx = ex + tdx;
      const ny = ey + tdy;
      if ( this.canEntityStepTo(e, nx, ny, allowPeers) ) {
        const d = this.manhattanTo(nx, ny, tx, ty);
        if ( d < bestDist ) {
          bestDist = d;
          bestDx = tdx;
          bestDy = tdy;
          found = true;
        }
      }
      dir = dir + 1;
    };
    if ( found ) {
      this.tryMoveEntity(e, bestDx, bestDy);
      return;
    }
    dir = 0;
    while (dir < 4) {
      let tdx2 = 0;
      let tdy2 = 0;
      if ( dir == 0 ) {
        tdx2 = 0;
        tdy2 = -1;
      }
      if ( dir == 1 ) {
        tdx2 = 0;
        tdy2 = 1;
      }
      if ( dir == 2 ) {
        tdx2 = -1;
        tdy2 = 0;
      }
      if ( dir == 3 ) {
        tdx2 = 1;
        tdy2 = 0;
      }
      const nx2 = ex + tdx2;
      const ny2 = ey + tdy2;
      if ( this.canEntityStepTo(e, nx2, ny2, allowPeers) ) {
        this.tryMoveEntity(e, tdx2, tdy2);
        return;
      }
      dir = dir + 1;
    };
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
    if ( this.entityBlocksPlayer(e) ) {
      return e;
    }
    return new MapEntity();
  };
  emitAmbient (e, line) {
    this.overheardMsg = ((e.name + ": \"") + line) + "\"";
    this.lastStatus = "";
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
    this.stepBestToward(e, tx, ty);
  };
  pickLeaveTargetFor (e, floorIndex) {
    this.leaveTargetX = this.foundElevatorX;
    this.leaveTargetY = this.foundElevatorY;
    if ( this.findElevatorAt(floorIndex) == false ) {
      return;
    }
    const slot = (e.homeX + e.homeY) + (e.id.length);
    let off = 0;
    while (off < 8) {
      const oidx = (slot + off) % 8;
      let ox = 0;
      let oy = 0;
      if ( oidx == 0 ) {
        ox = -1;
        oy = 0;
      }
      if ( oidx == 1 ) {
        ox = 1;
        oy = 0;
      }
      if ( oidx == 2 ) {
        ox = 0;
        oy = -1;
      }
      if ( oidx == 3 ) {
        ox = 0;
        oy = 1;
      }
      if ( oidx == 4 ) {
        ox = -1;
        oy = -1;
      }
      if ( oidx == 5 ) {
        ox = 1;
        oy = -1;
      }
      if ( oidx == 6 ) {
        ox = -1;
        oy = 1;
      }
      if ( oidx == 7 ) {
        ox = 1;
        oy = 1;
      }
      const tx = this.foundElevatorX + ox;
      const ty = this.foundElevatorY + oy;
      if ( this.canEntityStepTo(e, tx, ty, true) ) {
        this.leaveTargetX = tx;
        this.leaveTargetY = ty;
        return;
      }
      off = off + 1;
    };
  };
  leaveStaggerStart (e) {
    const seed = (e.homeX + (e.homeY * 3)) + (e.id.length);
    return 900 + (seed % 25);
  };
  scheduleMoveStride (e, gameMinutes) {
    const seed = (e.homeX + (e.homeY * 3)) + (e.id.length);
    if ( e.npcState == "leaving" ) {
      const phase = seed % 6;
      const tick = gameMinutes % 6;
      if ( phase == tick ) {
        return true;
      }
      return false;
    }
    const phase2 = seed % 4;
    const tick2 = gameMinutes % 4;
    if ( phase2 == tick2 ) {
      return true;
    }
    return false;
  };
  retireEntitySeek (entityId) {
    let fi = 0;
    const fc = this.floors.length;
    while (fi < fc) {
      const floor = this.floors[fi];
      const ents = floor.entities;
      let i = 0;
      const n = ents.length;
      while (i < n) {
        const ent = ents[i];
        if ( ent.id == entityId ) {
          ent.moveMode = "stationary";
          ent.agentGoal = "";
          return;
        }
        i = i + 1;
      };
      fi = fi + 1;
    };
  };
  activateEntitySeek (entityId, goal) {
    let fi = 0;
    const fc = this.floors.length;
    while (fi < fc) {
      const floor = this.floors[fi];
      const ents = floor.entities;
      let i = 0;
      const n = ents.length;
      while (i < n) {
        const ent = ents[i];
        if ( ent.id == entityId ) {
          ent.offDuty = false;
          ent.isAgent = true;
          ent.moveMode = "seek_player";
          if ( (goal.length) > 0 ) {
            ent.agentGoal = goal;
          }
          return;
        }
        i = i + 1;
      };
      fi = fi + 1;
    };
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
        const startLeave = this.leaveStaggerStart(e);
        if ( gameMinutes >= startLeave ) {
          if ( this.findElevatorAt(floorIndex) ) {
            this.pickLeaveTargetFor(e, floorIndex);
            tx = this.leaveTargetX;
            ty = this.leaveTargetY;
            e.npcState = "leaving";
            e.offDuty = false;
            const distElev = this.manhattanTo(e.x, e.y, this.foundElevatorX, this.foundElevatorY);
            if ( distElev <= 1 ) {
              if ( gameMinutes >= (startLeave + 8) ) {
                e.offDuty = true;
                e.npcState = "at_elevator";
                return;
              }
            }
          }
        }
      }
    }
    if ( this.scheduleMoveStride(e, gameMinutes) == false ) {
      return;
    }
    this.stepTowardTile(e, tx, ty);
  };
  tickSchedules (gameMinutes) {
    const savedFloor = this.currentFloor;
    let fi = 0;
    const fc = this.floors.length;
    while (fi < fc) {
      this.currentFloor = fi;
      this.recomputeSize();
      const floor = this.activeFloor();
      const ents = floor.entities;
      let i = 0;
      const n = ents.length;
      while (i < n) {
        const e = ents[i];
        if ( this.isActiveAgent(e) ) {
          this.applyEntitySchedule(fi, floor, e, gameMinutes);
        }
        i = i + 1;
      };
      fi = fi + 1;
    };
    this.currentFloor = savedFloor;
    this.recomputeSize();
  };
  tickAgents () {
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
      if ( e.offDuty ) {
        if ( e.kind != "police" ) {
          i = i + 1;
          continue;
        }
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
      if ( e.moveMode == "stationary" ) {
        i = i + 1;
        continue;
      }
      if ( e.moveMode == "seek_player" ) {
        if ( this.canNpcSeePlayer(e) ) {
          this.stepBestToward(e, this.playerX, this.playerY);
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
        if ( this.canNpcSeePlayer(e) ) {
          if ( e.agentGoal == "welcome_hr" ) {
            approach = e;
          }
          if ( e.sociability >= 70 ) {
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
      if ( ent.char != "!" ) {
        return ent.char;
      }
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
  findEntityById (entityId) {
    const blank = new MapEntity();
    if ( (entityId.length) < 1 ) {
      return blank;
    }
    let fi = 0;
    const fn = this.floors.length;
    while (fi < fn) {
      const floor = this.floors[fi];
      const ents = floor.entities;
      let ei = 0;
      const en = ents.length;
      while (ei < en) {
        const e = ents[ei];
        if ( e.id == entityId ) {
          return e;
        }
        ei = ei + 1;
      };
      fi = fi + 1;
    };
    return blank;
  };
  tickNpcMainTasks (gameMinutes) {
    let fi = 0;
    const fn = this.floors.length;
    while (fi < fn) {
      const floor = this.floors[fi];
      const ents = floor.entities;
      let ei = 0;
      const en = ents.length;
      while (ei < en) {
        const e = ents[ei];
        if ( (e.scheduleRole.length) > 0 ) {
          if ( e.npcState == "lunch" ) {
            e.mainTask = "eating";
          } else {
            if ( e.npcState == "desk_lunch" ) {
              e.mainTask = "eating";
            } else {
              if ( e.npcState == "lunch_out" ) {
                e.mainTask = "eating";
              } else {
                if ( gameMinutes >= 660 ) {
                  if ( gameMinutes < 780 ) {
                    if ( e.scheduleRole == "desk_lunch" ) {
                      e.mainTask = "eating";
                    }
                  }
                }
                const roll = Math.floor(Math.random()*(99 - 0 + 1) + 0);
                if ( roll < 3 ) {
                  e.mainTask = "toilet";
                } else {
                  if ( roll < 5 ) {
                    e.mainTask = "searching_item";
                  } else {
                    if ( roll > 96 ) {
                      e.mainTask = "coffee";
                    } else {
                      if ( e.mainTask != "eating" ) {
                        if ( e.mainTask != "toilet" ) {
                          if ( e.mainTask != "coffee" ) {
                            if ( e.mainTask != "searching_item" ) {
                              e.mainTask = "working";
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        ei = ei + 1;
      };
      fi = fi + 1;
    };
  };
  emitGossipNearPlayer (speaker, line) {
    const dist = this.manhattanTo(speaker.x, speaker.y, this.playerX, this.playerY);
    if ( dist > 8 ) {
      return;
    }
    this.emitAmbient(speaker, line);
  };
  countMainTaskOnFloor (floorIndex, task) {
    const saved = this.currentFloor;
    this.currentFloor = floorIndex;
    this.recomputeSize();
    const floor = this.activeFloor();
    const ents = floor.entities;
    let count = 0;
    let i = 0;
    const n = ents.length;
    while (i < n) {
      const e = ents[i];
      if ( e.mainTask == task ) {
        count = count + 1;
      }
      i = i + 1;
    };
    this.currentFloor = saved;
    this.recomputeSize();
    return count;
  };
  countMainTask (task) {
    let total = 0;
    let fi = 0;
    const fn = this.floors.length;
    while (fi < fn) {
      total = total + this.countMainTaskOnFloor(fi, task);
      fi = fi + 1;
    };
    return total;
  };
  applyPanicFleeing (npcIds, relations) {
    let fi = 0;
    const fn = this.floors.length;
    while (fi < fn) {
      const floor = this.floors[fi];
      const ents = floor.entities;
      let ei = 0;
      const en = ents.length;
      while (ei < en) {
        const e = ents[ei];
        if ( (e.id.length) < 1 ) {
          ei = ei + 1;
          continue;
        }
        let idx = -1;
        let ri = 0;
        const rn = npcIds.length;
        while (ri < rn) {
          if ( (npcIds[ri]) == e.id ) {
            idx = ri;
            break;
          }
          ri = ri + 1;
        };
        if ( idx >= 0 ) {
          const rel = relations[idx];
          if ( rel.isPanicSevere() ) {
            e.mainTask = "fleeing";
          }
        }
        ei = ei + 1;
      };
      fi = fi + 1;
    };
  };
  syncNpcOverlayEmotions (npcIds, relations) {
    let fi = 0;
    const fn = this.floors.length;
    while (fi < fn) {
      const floor = this.floors[fi];
      const ents = floor.entities;
      let ei = 0;
      const en = ents.length;
      while (ei < en) {
        const e = ents[ei];
        if ( (e.id.length) < 1 ) {
          ei = ei + 1;
          continue;
        }
        let idx = -1;
        let ri = 0;
        const rn = npcIds.length;
        while (ri < rn) {
          if ( (npcIds[ri]) == e.id ) {
            idx = ri;
            break;
          }
          ri = ri + 1;
        };
        e.overlayEmotion = "none";
        if ( idx >= 0 ) {
          const rel = relations[idx];
          if ( rel.isPanicHigh() ) {
            e.overlayEmotion = "panicked";
          } else {
            if ( rel.isAngryStrong() ) {
              e.overlayEmotion = "angry";
            } else {
              if ( rel.isLoveStrong() ) {
                e.overlayEmotion = "in_love";
              } else {
                if ( rel.isJealousyHigh() ) {
                  e.overlayEmotion = "jealous";
                }
              }
            }
          }
        }
        ei = ei + 1;
      };
      fi = fi + 1;
    };
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
      view.hintLine = "wasd | e=työkalu | h=piiloudu | i=inventaario | b=opiskelulista | t/x=työkalu | 1-9/0=hissi | ?=oppitunnit | q=lopeta";
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
class ActionView  {
  constructor() {
    this.mode = "";
    this.targetName = "";
    this.targetId = "";
    this.canTalk = false;
    this.talkName = "";
    this.toolIds = [];
    this.toolLabels = [];
    this.resultOk = false;
    this.resultMessage = "";
    this.hintLine = "";
  }
}
class PlayerNeeds  {
  constructor() {
    this.satiety = 18;
    this.thirst = 18;
    this.alertness = 16;
    this.gas = 0;
    this.satietyAccum = 0;
    this.thirstAccum = 0;
    this.alertnessAccum = 0;
  }
  resetDefaults () {
    this.satiety = 18;
    this.thirst = 18;
    this.alertness = 16;
    this.gas = 0;
    this.satietyAccum = 0;
    this.thirstAccum = 0;
    this.alertnessAccum = 0;
  };
  clampAll () {
    if ( this.satiety < 0 ) {
      this.satiety = 0;
    }
    if ( this.satiety > 20 ) {
      this.satiety = 20;
    }
    if ( this.thirst < 0 ) {
      this.thirst = 0;
    }
    if ( this.thirst > 20 ) {
      this.thirst = 20;
    }
    if ( this.alertness < 0 ) {
      this.alertness = 0;
    }
    if ( this.alertness > 20 ) {
      this.alertness = 20;
    }
    if ( this.gas < 0 ) {
      this.gas = 0;
    }
    if ( this.gas > 20 ) {
      this.gas = 20;
    }
  };
  tickMinutes (minutes) {
    if ( minutes < 1 ) {
      return;
    }
    this.satietyAccum = this.satietyAccum + minutes;
    while (this.satietyAccum >= 100) {
      this.satiety = this.satiety - 1;
      this.satietyAccum = this.satietyAccum - 100;
    };
    this.thirstAccum = this.thirstAccum + (minutes * 2);
    while (this.thirstAccum >= 100) {
      this.thirst = this.thirst - 1;
      this.thirstAccum = this.thirstAccum - 100;
    };
    this.alertnessAccum = this.alertnessAccum + (minutes * 15);
    while (this.alertnessAccum >= 1000) {
      this.alertness = this.alertness - 1;
      this.alertnessAccum = this.alertnessAccum - 1000;
    };
    this.clampAll();
  };
  applyEmojiChar (ch) {
    if ( ch == "☕" ) {
      this.alertness = this.alertness + 4;
      this.gas = this.gas + 1;
    }
    if ( ch == "🍱" ) {
      this.satiety = this.satiety + 5;
    }
    if ( ch == "🚽" ) {
      this.gas = this.gas - 4;
    }
    this.clampAll();
  };
  applyStatDelta (stat, delta) {
    if ( stat == "satiety" ) {
      this.satiety = this.satiety + delta;
    }
    if ( stat == "thirst" ) {
      this.thirst = this.thirst + delta;
    }
    if ( stat == "alertness" ) {
      this.alertness = this.alertness + delta;
    }
    if ( stat == "gas" ) {
      this.gas = this.gas + delta;
    }
    this.clampAll();
  };
  formatLine () {
    return (((((("Nälkä:" + ((this.satiety.toString()))) + " Jano:") + ((this.thirst.toString()))) + " Valppaus:") + ((this.alertness.toString()))) + " Kaasu:") + ((this.gas.toString()));
  };
}
class PlayerCoreStats  {
  constructor() {
    this.gender = "?";
    this.intelligence = 10;
    this.appearance = 10;
    this.luck = 10;
    this.intuition = 10;
    this.humour = 10;
  }
}
class NpcRelationStore  {
  constructor() {
    this.npcIds = [];
    this.relations = [];
  }
  reset () {
    let emptyIds = [];
    let emptyRels = [];
    this.npcIds = emptyIds;
    this.relations = emptyRels;
  };
  findIndex (npcId) {
    let i = 0;
    const n = this.npcIds.length;
    while (i < n) {
      if ( (this.npcIds[i]) == npcId ) {
        return i;
      }
      i = i + 1;
    };
    return -1;
  };
  getOrCreate (npcId) {
    const idx = this.findIndex(npcId);
    if ( idx >= 0 ) {
      return this.relations[idx];
    }
    const rel = new NpcRelation();
    rel.resetDefaults();
    this.npcIds.push(npcId);
    this.relations.push(rel);
    return rel;
  };
  countWithAngerAtLeast (threshold) {
    let count = 0;
    let i = 0;
    const n = this.relations.length;
    while (i < n) {
      const rel = this.relations[i];
      if ( rel.anger >= threshold ) {
        count = count + 1;
      }
      i = i + 1;
    };
    return count;
  };
  countWithPanicAtLeast (threshold) {
    let count = 0;
    let i = 0;
    const n = this.relations.length;
    while (i < n) {
      const rel = this.relations[i];
      if ( rel.panic >= threshold ) {
        count = count + 1;
      }
      i = i + 1;
    };
    return count;
  };
  countWithJealousyAtLeast (threshold) {
    let count = 0;
    let i = 0;
    const n = this.relations.length;
    while (i < n) {
      const rel = this.relations[i];
      if ( rel.jealousy >= threshold ) {
        count = count + 1;
      }
      i = i + 1;
    };
    return count;
  };
  countWithLoveAtLeast (threshold) {
    let count = 0;
    let i = 0;
    const n = this.relations.length;
    while (i < n) {
      const rel = this.relations[i];
      if ( rel.love >= threshold ) {
        count = count + 1;
      }
      i = i + 1;
    };
    return count;
  };
}
class EmotionMath  {
  constructor() {
  }
  normalizedStat (value) {
    const scaled = Math.floor( (value / 5));
    if ( scaled < 1 ) {
      return 1;
    }
    if ( scaled > 20 ) {
      return 20;
    }
    return scaled;
  };
  chanceBps (value) {
    value = this.normalizedStat(value);
    if ( value <= 1 ) {
      return 1;
    }
    if ( value >= 20 ) {
      return 2000;
    }
    if ( value == 2 ) {
      return 2;
    }
    if ( value == 3 ) {
      return 5;
    }
    if ( value == 4 ) {
      return 10;
    }
    if ( value == 5 ) {
      return 20;
    }
    if ( value == 6 ) {
      return 40;
    }
    if ( value == 7 ) {
      return 75;
    }
    if ( value == 8 ) {
      return 125;
    }
    if ( value == 9 ) {
      return 175;
    }
    if ( value == 10 ) {
      return 200;
    }
    if ( value == 11 ) {
      return 280;
    }
    if ( value == 12 ) {
      return 390;
    }
    if ( value == 13 ) {
      return 540;
    }
    if ( value == 14 ) {
      return 750;
    }
    if ( value == 15 ) {
      return 1050;
    }
    if ( value == 16 ) {
      return 1300;
    }
    if ( value == 17 ) {
      return 1550;
    }
    if ( value == 18 ) {
      return 1750;
    }
    if ( value == 19 ) {
      return 1900;
    }
    return 2000;
  };
  rollTriggers (value, roll) {
    const bps = this.chanceBps(value);
    if ( roll < bps ) {
      return true;
    }
    return false;
  };
}
class EmotionalAnswer  {
  constructor() {
    this.text = "";
    this.effectTargets = [];
    this.effectStats = [];
    this.effectDeltas = [];
  }
}
class EmotionalDialogue  {
  constructor() {
    this.id = "";
    this.text = "";
    this.category = "neutral";
    this.minAnger = 0;
    this.maxAnger = 20;
    this.minLove = 0;
    this.maxLove = 20;
    this.answers = [];
  }
}
class DialogueCatalog  {
  constructor() {
    this.dialogues = [];
    this.json = new StoryJson();
    let empty_6 = [];
    this.dialogues = empty_6;
  }
  reset () {
    let empty = [];
    this.dialogues = empty;
  };
  addEffect (answer, target, stat, delta) {
    answer.effectTargets.push(target);
    answer.effectStats.push(stat);
    answer.effectDeltas.push(delta);
  };
  loadDefaults () {
    this.reset();
    const neutral = new EmotionalDialogue();
    neutral.id = "neutral_work_stress";
    neutral.category = "neutral";
    neutral.text = "Miten sinä pysyt noin rauhallisena täällä?";
    neutral.minAnger = 0;
    neutral.maxAnger = 45;
    const na1 = new EmotionalAnswer();
    na1.text = "En pysykään, esitän vain.";
    this.addEffect(na1, "npc", "friendliness", 5);
    this.addEffect(na1, "npc", "respect", 5);
    const na2 = new EmotionalAnswer();
    na2.text = "Hyvä prosessi voittaa paniikin.";
    this.addEffect(na2, "npc", "respect", 10);
    const na3 = new EmotionalAnswer();
    na3.text = "En minä ehdi miettiä muiden ongelmia.";
    this.addEffect(na3, "npc", "anger", 10);
    this.addEffect(na3, "npc", "friendliness", -10);
    neutral.answers.push(na1);
    neutral.answers.push(na2);
    neutral.answers.push(na3);
    this.dialogues.push(neutral);
    const angry = new EmotionalDialogue();
    angry.id = "angry_confrontation_noise";
    angry.category = "angry";
    angry.text = "Kuuluiko tuo meteli sinusta jotenkin normaalilta?";
    angry.minAnger = 50;
    angry.maxAnger = 100;
    const aa1 = new EmotionalAnswer();
    aa1.text = "En kuullut mitään.";
    this.addEffect(aa1, "npc", "suspicion", 15);
    this.addEffect(aa1, "npc", "anger", 10);
    const aa2 = new EmotionalAnswer();
    aa2.text = "Selvitän asian heti.";
    this.addEffect(aa2, "npc", "respect", 5);
    this.addEffect(aa2, "npc", "anger", -5);
    const aa3 = new EmotionalAnswer();
    aa3.text = "Seinä aloitti.";
    this.addEffect(aa3, "npc", "anger", 20);
    angry.answers.push(aa1);
    angry.answers.push(aa2);
    angry.answers.push(aa3);
    this.dialogues.push(angry);
    const romantic = new EmotionalDialogue();
    romantic.id = "romantic_compliment";
    romantic.category = "romantic";
    romantic.text = "Sinä näytät tänään… poikkeuksellisen keskittyneeltä.";
    romantic.minAnger = 0;
    romantic.maxAnger = 60;
    romantic.minLove = 50;
    romantic.maxLove = 100;
    const ro1 = new EmotionalAnswer();
    ro1.text = "Kiitos, yritän parhaani.";
    this.addEffect(ro1, "npc", "love", 10);
    this.addEffect(ro1, "npc", "respect", 5);
    const ro2 = new EmotionalAnswer();
    ro2.text = "Flirttailetko minulle?";
    this.addEffect(ro2, "npc", "love", 15);
    this.addEffect(ro2, "npc", "jealousy", 5);
    const ro3 = new EmotionalAnswer();
    ro3.text = "Älä häiritse työntekoa.";
    this.addEffect(ro3, "npc", "love", -10);
    this.addEffect(ro3, "npc", "anger", 15);
    romantic.answers.push(ro1);
    romantic.answers.push(ro2);
    romantic.answers.push(ro3);
    this.dialogues.push(romantic);
    const help = new EmotionalDialogue();
    help.id = "help_usb_search";
    help.category = "help";
    help.text = "Oletko nähnyt minun USB-tikkuani? Se katosi jonnekin.";
    help.minAnger = 0;
    help.maxAnger = 100;
    const h1 = new EmotionalAnswer();
    h1.text = "Minulla on tikku — tässä.";
    this.addEffect(h1, "npc", "respect", 15);
    this.addEffect(h1, "player", "karma", 5);
    const h2 = new EmotionalAnswer();
    h2.text = "En ole nähnyt.";
    this.addEffect(h2, "npc", "friendliness", -5);
    const h3 = new EmotionalAnswer();
    h3.text = "Kysy IT:ltä.";
    this.addEffect(h3, "npc", "respect", 5);
    help.answers.push(h1);
    help.answers.push(h2);
    help.answers.push(h3);
    this.dialogues.push(help);
  };
  parseAnswer (dlg, answerObj) {
    const ans = new EmotionalAnswer();
    ans.text = this.json.objFieldStr(answerObj, "text");
    const effectsOpt = (answerObj["effects"] instanceof Array ) ? answerObj ["effects"] : undefined ;
    if ( typeof(effectsOpt) === "undefined" ) {
      dlg.answers.push(ans);
      return;
    }
    const effects = effectsOpt;
    let ei = 0;
    const en = effects.length;
    while (ei < en) {
      const eff = this.json.arrayObjectAt(effects, ei);
      const target = this.json.objFieldStr(eff, "target");
      const stat = this.json.objFieldStr(eff, "stat");
      const delta = this.json.objFieldInt(eff, "delta");
      if ( (stat.length) > 0 ) {
        this.addEffect(ans, target, stat, delta);
      }
      ei = ei + 1;
    };
    dlg.answers.push(ans);
  };
  loadFromText (raw) {
    this.reset();
    try {
      const rootOpt = JSON.parse(raw);
      if ( typeof(rootOpt) === "undefined" ) {
        this.loadDefaults();
        return false;
      }
      const root = rootOpt;
      const arrOpt = (root["dialogues"] instanceof Array ) ? root ["dialogues"] : undefined ;
      if ( typeof(arrOpt) === "undefined" ) {
        this.loadDefaults();
        return false;
      }
      const rootArr = arrOpt;
      let i = 0;
      const n = rootArr.length;
      while (i < n) {
        const dlgObj = this.json.arrayObjectAt(rootArr, i);
        const dlg = new EmotionalDialogue();
        dlg.id = this.json.objFieldStr(dlgObj, "id");
        dlg.text = this.json.objFieldStr(dlgObj, "text");
        dlg.category = this.json.objFieldStr(dlgObj, "category");
        if ( (dlg.category.length) < 1 ) {
          dlg.category = "neutral";
        }
        dlg.minAnger = this.json.objFieldInt(dlgObj, "minAnger");
        dlg.maxAnger = this.json.objFieldInt(dlgObj, "maxAnger");
        dlg.minLove = this.json.objFieldInt(dlgObj, "minLove");
        dlg.maxLove = this.json.objFieldInt(dlgObj, "maxLove");
        if ( dlg.maxLove < 1 ) {
          dlg.maxLove = 100;
        }
        const answersOpt = (dlgObj["answers"] instanceof Array ) ? dlgObj ["answers"] : undefined ;
        if ( typeof(answersOpt) === "undefined" ) {
          this.dialogues.push(dlg);
          i = i + 1;
          continue;
        }
        const answers = answersOpt;
        let ai = 0;
        const an = answers.length;
        while (ai < an) {
          this.parseAnswer(dlg, this.json.arrayObjectAt(answers, ai));
          ai = ai + 1;
        };
        this.dialogues.push(dlg);
        i = i + 1;
      };
      if ( (this.dialogues.length) < 1 ) {
        this.loadDefaults();
        return false;
      }
      return true;
    } catch(e) {
      this.loadDefaults();
    }
    return false;
  };
  pickIndex (relation) {
    let i = 0;
    const n = this.dialogues.length;
    while (i < n) {
      const dlg = this.dialogues[i];
      if ( relation.matchesAngerBand(dlg.minAnger, dlg.maxAnger) ) {
        return i;
      }
      i = i + 1;
    };
    return -1;
  };
  pickCategoryIndex (category, relation, entId) {
    let matches = [];
    let empty = [];
    matches = empty;
    let i = 0;
    const n = this.dialogues.length;
    while (i < n) {
      const dlg = this.dialogues[i];
      if ( dlg.category == category ) {
        if ( relation.matchesAngerBand(dlg.minAnger, dlg.maxAnger) ) {
          if ( relation.matchesLoveBand(dlg.minLove, dlg.maxLove) ) {
            matches.push(i);
          }
        }
      }
      i = i + 1;
    };
    const m = matches.length;
    if ( m < 1 ) {
      return -1;
    }
    if ( m == 1 ) {
      return matches[0];
    }
    const pick = Math.floor(Math.random()*((m - 1) - 0 + 1) + 0);
    return matches[pick];
  };
  pickForEncounter (relation, ent) {
    if ( ent.mainTask == "searching_item" ) {
      const helpIdx = this.pickCategoryIndex("help", relation, ent.id);
      if ( helpIdx >= 0 ) {
        return helpIdx;
      }
    }
    if ( relation.isAngryNoticeable() ) {
      const angryIdx = this.pickCategoryIndex("angry", relation, ent.id);
      if ( angryIdx >= 0 ) {
        return angryIdx;
      }
    }
    if ( relation.isLoveNoticeable() ) {
      const romanticIdx = this.pickCategoryIndex("romantic", relation, ent.id);
      if ( romanticIdx >= 0 ) {
        return romanticIdx;
      }
    }
    const neutralIdx = this.pickCategoryIndex("neutral", relation, ent.id);
    if ( neutralIdx >= 0 ) {
      return neutralIdx;
    }
    return this.pickIndex(relation);
  };
  dialogueAt (index) {
    if ( index < 0 ) {
      const blank = new EmotionalDialogue();
      return blank;
    }
    if ( index >= (this.dialogues.length) ) {
      const blank_1 = new EmotionalDialogue();
      return blank_1;
    }
    return this.dialogues[index];
  };
  answerCount (dialogueIndex) {
    const dlg = this.dialogueAt(dialogueIndex);
    return dlg.answers.length;
  };
  answerText (dialogueIndex, answerIndex) {
    const dlg = this.dialogueAt(dialogueIndex);
    if ( answerIndex < 0 ) {
      return "";
    }
    if ( answerIndex >= (dlg.answers.length) ) {
      return "";
    }
    const ans = dlg.answers[answerIndex];
    return ans.text;
  };
  applyAnswerToRelation (dialogueIndex, answerIndex, relation) {
    const dlg = this.dialogueAt(dialogueIndex);
    if ( answerIndex < 0 ) {
      return;
    }
    if ( answerIndex >= (dlg.answers.length) ) {
      return;
    }
    const ans = dlg.answers[answerIndex];
    let i = 0;
    const n = ans.effectStats.length;
    while (i < n) {
      const target = ans.effectTargets[i];
      const stat = ans.effectStats[i];
      const delta = ans.effectDeltas[i];
      if ( target == "npc" ) {
        relation.applyStatDelta(stat, delta);
      }
      i = i + 1;
    };
  };
}
class ProximityGreeting  {
  constructor() {
  }
  playerLabel (playerName) {
    if ( (playerName.length) > 0 ) {
      return playerName;
    }
    return "sinä";
  };
  wrapSpeech (npcName, speech) {
    return ((npcName + ": \"") + speech) + "\"";
  };
  wrapNarration (npcName, narration) {
    return (npcName + " ") + narration;
  };
  pickPoolIndex (seed, poolSize) {
    if ( poolSize < 1 ) {
      return 0;
    }
    let idx = seed;
    while (idx >= poolSize) {
      idx = idx - poolSize;
    };
    while (idx < 0) {
      idx = idx + poolSize;
    };
    return idx;
  };
  neutralSpeech (index, who) {
    if ( index == 0 ) {
      return ("Hei " + who) + "!";
    }
    if ( index == 1 ) {
      return ("Huomenta " + who) + ".";
    }
    if ( index == 2 ) {
      return ("Päivää " + who) + "!";
    }
    if ( index == 3 ) {
      return ("Moro " + who) + "!";
    }
    if ( index == 4 ) {
      return ("Hei hei " + who) + "!";
    }
    if ( index == 5 ) {
      return who + " — hyvä nähdä.";
    }
    if ( index == 6 ) {
      return ("Ai " + who) + "?";
    }
    if ( index == 7 ) {
      return ("Terve " + who) + "!";
    }
    if ( index == 8 ) {
      return ("No hei " + who) + ".";
    }
    return ("Hei " + who) + ", mitä kuuluu?";
  };
  friendlySpeech (index, who) {
    if ( index == 0 ) {
      return ("Hei " + who) + "! Hyvä nähdä.";
    }
    if ( index == 1 ) {
      return ("Oi " + who) + " — mitä kuuluu?";
    }
    if ( index == 2 ) {
      return who + ", sinulla näyttää olevan hyvä päivä.";
    }
    if ( index == 3 ) {
      return ("Haikaa " + who) + "!";
    }
    if ( index == 4 ) {
      return ("Hei kollega " + who) + "!";
    }
    return who + ", olipa kiva törmätä.";
  };
  loveSpeech (index, who) {
    if ( index == 0 ) {
      return ("Hei " + who) + "…";
    }
    if ( index == 1 ) {
      return who + ", sinä taas täällä.";
    }
    if ( index == 2 ) {
      return ("Voi " + who) + ", sinä loistat tänään.";
    }
    return ("Hei " + who) + ", olin juuri ajatellut sinua.";
  };
  angryMildSpeech (index, who) {
    if ( index == 0 ) {
      return "Hei.";
    }
    if ( index == 1 ) {
      return who + ".";
    }
    if ( index == 2 ) {
      return "Ai, sinä.";
    }
    if ( index == 3 ) {
      return "No terve sitten.";
    }
    return ("Hm. " + who) + ".";
  };
  angryStrongSpeech (index) {
    if ( index == 0 ) {
      return "...";
    }
    if ( index == 1 ) {
      return "Mitä?";
    }
    if ( index == 2 ) {
      return "Älä häiritse.";
    }
    return "Häh.";
  };
  fearSpeech (index, who) {
    if ( index == 0 ) {
      return ("Hei… " + who) + ".";
    }
    if ( index == 1 ) {
      return ("Ai, " + who) + "…";
    }
    return ("Öö… hei " + who) + ".";
  };
  jealousSpeech (index, who) {
    if ( index == 0 ) {
      return ("Hei " + who) + ".";
    }
    if ( index == 1 ) {
      return who + "… taas.";
    }
    return ("No hei sitten, " + who) + ".";
  };
  coldSpeech (index, who) {
    if ( index == 0 ) {
      return "Hei.";
    }
    if ( index == 1 ) {
      return who + ".";
    }
    return "Päivää.";
  };
  janitorSpeech (index, who, angry) {
    if ( angry ) {
      if ( index == 0 ) {
        return "Hei.";
      }
      return "Kiirettä.";
    }
    if ( index == 0 ) {
      return ("Hei " + who) + "! Piha on rauhallinen tänään.";
    }
    if ( index == 1 ) {
      return ("Päivää " + who) + " — aurinko paistaa.";
    }
    if ( index == 2 ) {
      return ("Moro " + who) + ", kaikki kunnossa pihalla.";
    }
    return ("Hei " + who) + ", hyvä että tulit ulos.";
  };
  buildLine (npc, rel, playerName) {
    const who = this.playerLabel(playerName);
    const seed = rel.greetCount;
    if ( npc.id == "janitor" ) {
      const jIdx = this.pickPoolIndex(seed, 4);
      let jAngry = false;
      if ( rel.isAngryStrong() ) {
        jAngry = true;
      }
      return this.wrapSpeech(npc.name, this.janitorSpeech(jIdx, who, jAngry));
    }
    if ( rel.isPanicHigh() ) {
      if ( npc.overlayEmotion == "panicked" ) {
        return this.wrapNarration(npc.name, "hengästyy: \"Anteeksi — en ehdi nyt.\"");
      }
      return this.wrapNarration(npc.name, "näyttää paniikissa.");
    }
    if ( rel.isAngrySevere() ) {
      if ( npc.overlayEmotion == "angry" ) {
        return this.wrapNarration(npc.name, "näyttää jotenkin vaikealta.");
      }
      const aIdx = this.pickPoolIndex(seed, 4);
      return this.wrapSpeech(npc.name, this.angryStrongSpeech(aIdx));
    }
    if ( rel.isAngryNoticeable() ) {
      if ( npc.overlayEmotion == "angry" ) {
        return this.wrapNarration(npc.name, "näyttää jotenkin vaikealta.");
      }
      const amIdx = this.pickPoolIndex(seed, 5);
      return this.wrapSpeech(npc.name, this.angryMildSpeech(amIdx, who));
    }
    if ( rel.isLoveStrong() ) {
      if ( npc.overlayEmotion == "in_love" ) {
        const lvIdx = this.pickPoolIndex(seed, 4);
        return this.wrapSpeech(npc.name, this.loveSpeech(lvIdx, who));
      }
    }
    if ( npc.overlayEmotion == "in_love" ) {
      const lv2Idx = this.pickPoolIndex(seed, 4);
      return this.wrapSpeech(npc.name, this.loveSpeech(lv2Idx, who));
    }
    if ( rel.isJealousyHigh() ) {
      const jelIdx = this.pickPoolIndex(seed, 3);
      return this.wrapSpeech(npc.name, this.jealousSpeech(jelIdx, who));
    }
    if ( npc.overlayEmotion == "jealous" ) {
      const jel2Idx = this.pickPoolIndex(seed, 3);
      return this.wrapSpeech(npc.name, this.jealousSpeech(jel2Idx, who));
    }
    if ( rel.isFearHigh() ) {
      const fIdx = this.pickPoolIndex(seed, 3);
      return this.wrapSpeech(npc.name, this.fearSpeech(fIdx, who));
    }
    if ( rel.isFriendlinessWarm() ) {
      const frIdx = this.pickPoolIndex(seed, 6);
      return this.wrapSpeech(npc.name, this.friendlySpeech(frIdx, who));
    }
    if ( rel.isRespectLow() ) {
      if ( rel.isFriendlinessCold() ) {
        const cIdx = this.pickPoolIndex(seed, 3);
        return this.wrapSpeech(npc.name, this.coldSpeech(cIdx, who));
      }
    }
    const nIdx = this.pickPoolIndex(seed, 10);
    return this.wrapSpeech(npc.name, this.neutralSpeech(nIdx, who));
  };
}
class WorldClock  {
  constructor() {
    this.gameMinutes = 480;
    this.lastSpentMinutes = 0;
  }
  advance (delta) {
    if ( delta < 1 ) {
      return;
    }
    this.gameMinutes = this.gameMinutes + delta;
    if ( this.gameMinutes >= 1080 ) {
      this.gameMinutes = 480;
    }
  };
  spendTime (delta) {
    if ( delta < 1 ) {
      this.lastSpentMinutes = 0;
      return 0;
    }
    this.advance(delta);
    this.lastSpentMinutes = delta;
    return delta;
  };
  setGameMinutes (minutes) {
    if ( minutes < 0 ) {
      this.gameMinutes = 0;
      return;
    }
    this.gameMinutes = minutes;
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
class EventPerception  {
  constructor() {
  }
  manhattan (x1, y1, x2, y2) {
    let dx = x1 - x2;
    if ( dx < 0 ) {
      dx = 0 - dx;
    }
    let dy = y1 - y2;
    if ( dy < 0 ) {
      dy = 0 - dy;
    }
    return dx + dy;
  };
  curiosity (npc) {
    let c = Math.floor( (npc.sociability / 10));
    if ( c < 2 ) {
      c = 2;
    }
    if ( c > 10 ) {
      c = 10;
    }
    return c;
  };
  noticePercent (npc, evt, rel) {
    const dist = this.manhattan(npc.x, npc.y, evt.x, evt.y);
    const cur = this.curiosity(npc);
    const hearing = (((evt.noise * 3) - (dist * 2)) + cur) + rel.suspicion;
    const seeing = ((evt.visibility * 3) - (dist * 3)) + cur;
    let total = hearing + seeing;
    if ( total < 0 ) {
      total = 0;
    }
    if ( total > 95 ) {
      total = 95;
    }
    return total;
  };
  noticesWithRoll (percent, roll) {
    if ( roll < percent ) {
      return true;
    }
    return false;
  };
}
class Escalation  {
  constructor() {
  }
  angryGroupThreshold () {
    return 3;
  };
  panicThreshold () {
    return 3;
  };
  jealousyGossipThreshold () {
    return 2;
  };
  fleeingEvacuationThreshold () {
    return 3;
  };
  shouldAngryGroup (store) {
    const count = store.countWithAngerAtLeast(75);
    if ( count >= this.angryGroupThreshold() ) {
      return true;
    }
    return false;
  };
  shouldWorkplacePanic (store) {
    const count = store.countWithPanicAtLeast(75);
    if ( count >= this.panicThreshold() ) {
      return true;
    }
    return false;
  };
  shouldBackstabbingGossip (store) {
    const count = store.countWithJealousyAtLeast(75);
    if ( count >= this.jealousyGossipThreshold() ) {
      return true;
    }
    return false;
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
    this.relationTickAccum = 0;
    this.socialTickAccum = 0;
    this.escalatedAngry = false;
    this.escalatedPanic = false;
    this.escalatedJealous = false;
    this.pendingEmotionalDialogueIndex = -1;
    this.gameOverReason = "";
    this.encounterCooldown = 0;
    this.interviewPassed = false;
    this.interviewFailed = false;
    this.usedStolenCardEntry = false;
    this.guruIntroPassed = false;
    this.guruStoryAttempted = false;
    this.guruQuizCorrect = 0;
    this.hrWelcomeDone = false;
    this.quizWinsForPromotion = 0;
    this.actionTargetX = 0;
    this.actionTargetY = 0;
    this.actionTargetId = "";
    this.actionTargetTile = "";
    this.actionPhase = "";
    this.actionResultOk = false;
    this.actionResultMessage = "";
    this.actionPendingStoryId = "";
    this.blockedTalkId = "";
    this.blockedTalkChar = "";
    this.blockedTalkName = "";
    this.blockedTalkKind = "";
    this.blockedTalkStoryId = "";
    this.simSeed = 0;
    this.simRngState = 1;
    this.simScenarioId = "";
    this.simOutcome = "running";
    this.simStepCount = 0;
    this.simMinutesAccum = 0;
    this.simEventTypes = [];
    this.simEventDetails = [];
    this.simErrors = [];
    this.playerDisplayName = "";
    this.playerSpecialty = "";
    this.profileComplete = false;
    this.pendingGreetNpcId = "";
    this.karma = new FeatureKarma();
    this._map = new WorldMap();
    this.catalog = new StoryCatalog();
    this.conduct = new PlayerConduct();
    this.tools = new PlayerTools();
    this.playerNeeds = new PlayerNeeds();
    this.playerStats = new PlayerCoreStats();
    this.npcRelations = new NpcRelationStore();
    this.dialogueCatalog = new DialogueCatalog();
    this.emotionMath = new EmotionMath();
    this.eventPerception = new EventPerception();
    this.escalation = new Escalation();
    this.worldClock = new WorldClock();
    this.simJson = new StoryJson();
    this.proximityGreeting = new ProximityGreeting();
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
    if ( this.pendingEntityId == "hr-greeter" ) {
      if ( this.hrWelcomeDone ) {
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
      let status = "✓ " + msg;
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
        this.syncHrGreeter();
      }
      if ( this.pendingEntityId == "hr-greeter" ) {
        this.hrWelcomeDone = true;
        this._map.retireEntitySeek("hr-greeter");
        status = status + " HR toivottaa sinut virallisesti tervetulleeksi tiimiin.";
      }
      this._map.overheardMsg = "";
      this._map.lastStatus = status;
    } else {
      this.karma.loseKarma(3);
      let failStatus = "✗ " + msg;
      if ( this.pendingEntityId == "receptionist" ) {
        this.interviewFailed = true;
        this.interviewPassed = false;
        failStatus = failStatus + " Haastattelu ei mennyt läpi. Voit yrittää uudelleen tai käyttää varastettua korttia — riskillä.";
      }
      if ( this.pendingEntityId == "hr-greeter" ) {
        this.hrWelcomeDone = true;
        this._map.retireEntitySeek("hr-greeter");
        failStatus = failStatus + " HR jättää sinulle onboarding-materiaalit myöhemmin.";
      }
      this._map.overheardMsg = "";
      this._map.lastStatus = failStatus;
    }
    this.clearEncounter();
    this.screen = "map";
    this.afterTimedAction("quiz_answer");
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
    this.afterTimedAction("talk");
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
    if ( this.pendingEntityId == "staff-f7-hermit" ) {
      return this.pendingEntityName + " räpäyttää silmiään valoa vasten: \"Joko projekti on valmis?! Olen odottanut compliance-kierrosta… tai auringonnousua. Kumpi tulee ensin, selviää yhdellä kysymyksellä.\"";
    }
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
    if ( this.pendingEntityId == "hr-greeter" ) {
      if ( this.hrWelcomeDone ) {
        return this.pendingEntityName + " nyökkää: \"Nähdään tauolla — tervetuloa mukaan!\"";
      }
      return this.pendingEntityName + " lähestyy: \"Hei! Tervetuloa Koodisampoon. Vastataan pariin pikaiseen aloituskysymykseen, niin pääset kunnolla alkuun.\"";
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
    this.pendingEmotionalDialogueIndex = -1;
    this.encounterCooldown = 3;
  };
  startEncounter (bump) {
    this.clearPendingGreetWithAck(bump.id);
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
    this.bootstrapPlayerVitals();
    this.syncHrGreeter();
    this.syncProfileScreen();
    this.markStateDirty();
    return ok;
  };
  needsProfileSetup () {
    if ( this.profileComplete == false ) {
      return true;
    }
    if ( (this.playerDisplayName.length) < 1 ) {
      return true;
    }
    return false;
  };
  syncProfileScreen () {
    if ( this.needsProfileSetup() ) {
      this.profileComplete = false;
      this.screen = "setup";
    } else {
      this.screen = "map";
    }
  };
  applyPlayerProfile (name, specialty) {
    if ( (name.length) < 1 ) {
      return;
    }
    this.playerDisplayName = name;
    this.playerSpecialty = specialty;
    this.profileComplete = true;
    this._map.playerAlias = name;
    this.screen = "map";
    this.markStateDirty();
  };
  clearPlayerProfile () {
    this.playerDisplayName = "";
    this.playerSpecialty = "";
    this.profileComplete = false;
    this.screen = "setup";
    this.markStateDirty();
  };
  manhattanToPlayer (ex, ey) {
    let dx = ex - this._map.playerX;
    if ( dx < 0 ) {
      dx = 0 - dx;
    }
    let dy = ey - this._map.playerY;
    if ( dy < 0 ) {
      dy = 0 - dy;
    }
    return dx + dy;
  };
  isNpcNearPlayer (npcId) {
    const ent = this._map.findEntityById(npcId);
    if ( (ent.id.length) < 1 ) {
      return false;
    }
    if ( ent.offDuty ) {
      return false;
    }
    const dist = this.manhattanToPlayer(ent.x, ent.y);
    if ( dist > 3 ) {
      return false;
    }
    if ( this._map.hasLineOfSight(ent.x, ent.y, this._map.playerX, this._map.playerY) == false ) {
      return false;
    }
    return true;
  };
  applyGreetSnub (npcId) {
    const rel = this.npcRelations.getOrCreate(npcId);
    rel.applyStatDelta("respect", -4);
    rel.applyStatDelta("friendliness", -3);
    rel.applyStatDelta("anger", 6);
    rel.snubCount = rel.snubCount + 1;
    this._map.syncNpcOverlayEmotions(this.npcRelations.npcIds, this.npcRelations.relations);
  };
  applyGreetAck (npcId) {
    const rel = this.npcRelations.getOrCreate(npcId);
    rel.applyStatDelta("respect", 5);
    rel.applyStatDelta("friendliness", 4);
    if ( rel.anger > 0 ) {
      if ( rel.anger >= 6 ) {
        rel.applyStatDelta("anger", -6);
      } else {
        rel.setStat("anger", 0);
      }
    }
    this._map.syncNpcOverlayEmotions(this.npcRelations.npcIds, this.npcRelations.relations);
  };
  evaluatePendingGreetSnub () {
    if ( (this.pendingGreetNpcId.length) < 1 ) {
      return;
    }
    if ( this.isNpcNearPlayer(this.pendingGreetNpcId) ) {
      return;
    }
    this.applyGreetSnub(this.pendingGreetNpcId);
    this.pendingGreetNpcId = "";
  };
  clearPendingGreetWithAck (npcId) {
    if ( (this.pendingGreetNpcId.length) < 1 ) {
      return;
    }
    if ( this.pendingGreetNpcId == npcId ) {
      this.applyGreetAck(npcId);
      this.pendingGreetNpcId = "";
      return;
    }
    this.applyGreetSnub(this.pendingGreetNpcId);
    this.pendingGreetNpcId = "";
  };
  startPendingGreet (npcId) {
    if ( (this.pendingGreetNpcId.length) > 0 ) {
      if ( this.pendingGreetNpcId != npcId ) {
        this.applyGreetSnub(this.pendingGreetNpcId);
      }
    }
    this.pendingGreetNpcId = npcId;
  };
  checkProximityGreetings () {
    if ( this.screen != "map" ) {
      return;
    }
    if ( this.profileComplete == false ) {
      return;
    }
    this.evaluatePendingGreetSnub();
    const floor = this._map.activeFloor();
    const ents = floor.entities;
    let i = 0;
    const n = ents.length;
    let best = new MapEntity();
    let bestDist = 99;
    while (i < n) {
      const e = ents[i];
      if ( (e.id.length) < 1 ) {
        i = i + 1;
        continue;
      }
      if ( e.kind == "item" ) {
        i = i + 1;
        continue;
      }
      if ( e.kind == "police" ) {
        i = i + 1;
        continue;
      }
      if ( e.kind == "hostile" ) {
        i = i + 1;
        continue;
      }
      if ( e.kind == "pet" ) {
        i = i + 1;
        continue;
      }
      if ( e.offDuty ) {
        i = i + 1;
        continue;
      }
      if ( e.kind != "coworker" ) {
        if ( e.kind != "guru" ) {
          if ( e.kind != "role" ) {
            i = i + 1;
            continue;
          }
        }
      }
      if ( this._map.canNpcSeePlayer(e) == false ) {
        i = i + 1;
        continue;
      }
      if ( this._map.hasLineOfSight(e.x, e.y, this._map.playerX, this._map.playerY) == false ) {
        i = i + 1;
        continue;
      }
      if ( e.greetCooldownUntil > this.worldClock.gameMinutes ) {
        i = i + 1;
        continue;
      }
      let dx = e.x - this._map.playerX;
      if ( dx < 0 ) {
        dx = 0 - dx;
      }
      let dy = e.y - this._map.playerY;
      if ( dy < 0 ) {
        dy = 0 - dy;
      }
      const dist = dx + dy;
      if ( dist <= 3 ) {
        if ( dist < bestDist ) {
          bestDist = dist;
          best = e;
        }
      }
      i = i + 1;
    };
    if ( (best.id.length) < 1 ) {
      return;
    }
    this._map.syncNpcOverlayEmotions(this.npcRelations.npcIds, this.npcRelations.relations);
    const rel = this.npcRelations.getOrCreate(best.id);
    rel.greetCount = rel.greetCount + 1;
    this.startPendingGreet(best.id);
    const line = this.proximityGreeting.buildLine(best, rel, this.playerDisplayName);
    this._map.overheardMsg = line;
    this._map.lastStatus = "";
    best.greetCooldownUntil = this.worldClock.gameMinutes + 20;
    this.markStateDirty();
  };
  syncHrGreeter () {
    if ( this.hrWelcomeDone ) {
      this._map.retireEntitySeek("hr-greeter");
      return;
    }
    if ( this.interviewPassed ) {
      this._map.activateEntitySeek("hr-greeter", "welcome_hr");
      return;
    }
    if ( this.tools.hasOfficialBadge ) {
      this._map.activateEntitySeek("hr-greeter", "welcome_hr");
    }
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
  rollPlayerCoreStats () {
    let g = Math.floor(Math.random()*(1 - 0 + 1) + 0);
    if ( this.simSeed > 0 ) {
      g = this.simRngNext(0, 1);
    }
    if ( g == 0 ) {
      this.playerStats.gender = "M";
    } else {
      this.playerStats.gender = "F";
    }
    if ( this.simSeed > 0 ) {
      this.playerStats.intelligence = this.simRngNext(1, 20);
      this.playerStats.appearance = this.simRngNext(1, 20);
      this.playerStats.luck = this.simRngNext(1, 20);
      this.playerStats.intuition = this.simRngNext(1, 20);
      this.playerStats.humour = this.simRngNext(1, 20);
    } else {
      this.playerStats.intelligence = Math.floor(Math.random()*(20 - 1 + 1) + 1);
      this.playerStats.appearance = Math.floor(Math.random()*(20 - 1 + 1) + 1);
      this.playerStats.luck = Math.floor(Math.random()*(20 - 1 + 1) + 1);
      this.playerStats.intuition = Math.floor(Math.random()*(20 - 1 + 1) + 1);
      this.playerStats.humour = Math.floor(Math.random()*(20 - 1 + 1) + 1);
    }
  };
  bootstrapPlayerVitals () {
    this.playerNeeds.resetDefaults();
    this.npcRelations.reset();
    this.dialogueCatalog.loadDefaults();
    this.relationTickAccum = 0;
    this.socialTickAccum = 0;
    this.escalatedAngry = false;
    this.escalatedPanic = false;
    this.escalatedJealous = false;
    this.pendingEmotionalDialogueIndex = -1;
    this.rollPlayerCoreStats();
    this.gameOverReason = "";
  };
  loadEmotionalDialoguesFromText (raw) {
    const ok = this.dialogueCatalog.loadFromText(raw);
    this.markStateDirty();
    return ok;
  };
  setNpcRelationStat (npcId, stat, value) {
    const rel = this.npcRelations.getOrCreate(npcId);
    rel.setStat(stat, value);
    this.markStateDirty();
  };
  needsEmotionalEncounter () {
    if ( this.pendingEntityId == "receptionist" ) {
      return false;
    }
    if ( this.pendingEntityId == "hr-greeter" ) {
      return false;
    }
    if ( this.pendingEntityKind == "guru" ) {
      return false;
    }
    if ( this.pendingEntityKind == "security" ) {
      return false;
    }
    if ( this.pendingEntityKind == "hostile" ) {
      return false;
    }
    if ( this.pendingEntityKind == "police" ) {
      return false;
    }
    if ( this.isCoworkerEncounter() == false ) {
      return false;
    }
    const rel = this.npcRelations.getOrCreate(this.pendingEntityId);
    if ( rel.isAngryNoticeable() ) {
      return true;
    }
    return false;
  };
  applyWcTalkAngerIfNeeded () {
    const ent = this._map.findEntityById(this.pendingEntityId);
    if ( (ent.id.length) < 1 ) {
      return;
    }
    if ( ent.mainTask != "toilet" ) {
      return;
    }
    const rel = this.npcRelations.getOrCreate(this.pendingEntityId);
    rel.applyStatDelta("anger", 15);
    this._map.lastStatus = this.pendingEntityName + " ärsyyntyi — häiritsit WC:llä!";
  };
  tickNpcRelations () {
    this._map.tickNpcMainTasks(this.worldClock.gameMinutes);
    this._map.syncNpcOverlayEmotions(this.npcRelations.npcIds, this.npcRelations.relations);
    this.checkEscalation();
    this.evaluateNpcReporting();
    this.checkFiredGameOver();
    this.socialTickAccum = this.socialTickAccum + 5;
    while (this.socialTickAccum >= 10) {
      this.socialTickAccum = this.socialTickAccum - 10;
      this.trySocialGossipTick();
    };
  };
  romanticMatch (ent) {
    if ( ent.romanticPreference == "any" ) {
      return true;
    }
    if ( ent.romanticPreference == this.playerStats.gender ) {
      return true;
    }
    return false;
  };
  shouldUseEmotionalDialogue (ent, rel) {
    if ( this.isCoworkerEncounter() == false ) {
      return false;
    }
    if ( ent.mainTask == "searching_item" ) {
      return true;
    }
    if ( rel.isAngryNoticeable() ) {
      return true;
    }
    if ( rel.isLoveNoticeable() ) {
      if ( this.romanticMatch(ent) ) {
        return true;
      }
    }
    const socialRoll = Math.floor(Math.random()*(99 - 0 + 1) + 0);
    if ( socialRoll < 45 ) {
      return true;
    }
    return false;
  };
  applyTalkLoveBump (ent, rel) {
    if ( this.romanticMatch(ent) == false ) {
      return;
    }
    if ( this.playerStats.appearance < 8 ) {
      return;
    }
    rel.applyStatDelta("love", 5);
  };
  applyHelpAnswerEffects (ent, answerIndex, dialogueIndex) {
    const dlg = this.dialogueCatalog.dialogueAt(dialogueIndex);
    if ( dlg.category != "help" ) {
      return;
    }
    if ( answerIndex != 0 ) {
      return;
    }
    if ( this.tools.hasUsbDrive ) {
      this.karma.add("help_usb", 5);
      ent.mainTask = "working";
      this._map.lastStatus = ent.name + " kiittää — USB pelasti päivän!";
    } else {
      this._map.lastStatus = "Sinulla ei ole USB-tikkua taskussa.";
    }
  };
  applyLoveFollowup (ent, rel) {
    if ( rel.isLoveModerate() ) {
      ent.moveMode = "seek_player";
      ent.agentGoal = "socialize";
    }
    if ( rel.isLoveNoticeable() ) {
      const savedFloor = this._map.currentFloor;
      let fi = 0;
      const fn = this._map.floorCount();
      while (fi < fn) {
        this._map.currentFloor = fi;
        this._map.recomputeSize();
        const floor = this._map.activeFloor();
        const ents = floor.entities;
        let ei = 0;
        const en = ents.length;
        while (ei < en) {
          const other = ents[ei];
          if ( other.kind == "coworker" ) {
            if ( other.id != ent.id ) {
              let dx = other.x - ent.x;
              if ( dx < 0 ) {
                dx = 0 - dx;
              }
              let dy = other.y - ent.y;
              if ( dy < 0 ) {
                dy = 0 - dy;
              }
              if ( (dx + dy) <= 4 ) {
                const otherRel = this.npcRelations.getOrCreate(other.id);
                otherRel.applyStatDelta("jealousy", 5);
              }
            }
          }
          ei = ei + 1;
        };
        fi = fi + 1;
      };
      this._map.currentFloor = savedFloor;
      this._map.recomputeSize();
    }
  };
  triggerEscalationEvent (eventType, status) {
    const evt = new WorldEvent();
    evt.timeMinutes = this.worldClock.gameMinutes;
    evt.x = this._map.playerX;
    evt.y = this._map.playerY;
    evt.playerSource = false;
    if ( eventType == "WorkplacePanic" ) {
      evt.applyWorkplacePanic();
    } else {
      if ( eventType == "AngryGroupComplaint" ) {
        evt.applyAngryGroupComplaint();
      } else {
        if ( eventType == "GossipStarted" ) {
          evt.applyGossipStarted();
        } else {
          if ( eventType == "PraisePlayer" ) {
            evt.applyPraisePlayer();
          }
        }
      }
    }
    this._map.pushWorldEvent(evt);
    this._map.overheardMsg = "";
    this._map.lastStatus = status;
  };
  checkEscalation () {
    if ( this.escalatedAngry == false ) {
      if ( this.escalation.shouldAngryGroup((this.npcRelations)) ) {
        this.escalatedAngry = true;
        this.triggerEscalationEvent("AngryGroupComplaint", "Kollegat valittavat yhdessä — ilmapiiri kiristyy.");
      }
    }
    if ( this.escalatedPanic == false ) {
      if ( this.escalation.shouldWorkplacePanic((this.npcRelations)) ) {
        this.escalatedPanic = true;
        this.triggerEscalationEvent("WorkplacePanic", "Toimistossa puhkeaa paniikki!");
        this._map.applyPanicFleeing(this.npcRelations.npcIds, this.npcRelations.relations);
      }
    }
    if ( this.escalatedJealous == false ) {
      if ( this.escalation.shouldBackstabbingGossip((this.npcRelations)) ) {
        this.escalatedJealous = true;
        this.triggerEscalationEvent("GossipStarted", "Käytäväkuiskaukset leviävät.");
        this.tryGossipFromJealousNpc();
      }
    }
    const fleeing = this._map.countMainTask("fleeing");
    if ( fleeing >= this.escalation.fleeingEvacuationThreshold() ) {
      this.gameOverEvacuated();
    }
  };
  tryGossipFromJealousNpc () {
    let i = 0;
    const n = this.npcRelations.npcIds.length;
    while (i < n) {
      const rel = this.npcRelations.relations[i];
      if ( rel.isJealousySevere() ) {
        const npcId = this.npcRelations.npcIds[i];
        const ent = this._map.findEntityById(npcId);
        if ( (ent.id.length) > 0 ) {
          this._map.emitGossipNearPlayer(ent, "Kuulin jotain epäilyttävää Larrysta…");
          return;
        }
      }
      i = i + 1;
    };
  };
  trySocialGossipTick () {
    const roll = this.gameRollPercent();
    if ( roll >= 20 ) {
      return;
    }
    let i = 0;
    const n = this.npcRelations.npcIds.length;
    while (i < n) {
      const rel = this.npcRelations.relations[i];
      if ( rel.isJealousyHigh() ) {
        const npcId = this.npcRelations.npcIds[i];
        const ent = this._map.findEntityById(npcId);
        if ( (ent.id.length) > 0 ) {
          this._map.emitGossipNearPlayer(ent, "Sanovat että Larry ei ole ihan rehellinen…");
          const evt = new WorldEvent();
          evt.applyGossipStarted();
          evt.x = ent.x;
          evt.y = ent.y;
          evt.timeMinutes = this.worldClock.gameMinutes;
          this._map.pushWorldEvent(evt);
          return;
        }
      }
      i = i + 1;
    };
    if ( this.npcRelations.countWithLoveAtLeast(70) >= 1 ) {
      this.triggerEscalationEvent("PraisePlayer", "Joku kehuu sinua käytävällä.");
    }
  };
  enterEpilogue (reason) {
    this.ensureEngine();
    this.gameOverReason = reason;
    this.screen = "epilogue";
    this.markStateDirty();
  };
  gameOverEvacuated () {
    if ( this.screen == "epilogue" ) {
      return;
    }
    if ( this.screen == "gameover" ) {
      return;
    }
    this._map.lastStatus = "Liian moni kollega pakeni — toimisto evakuoitiin.";
    this.enterEpilogue("WorkplaceEvacuated");
  };
  buildEpilogueJson () {
    let out = "{";
    out = ((out + "\"reason\":\"") + this.simEscapeJson(this.gameOverReason)) + "\",";
    out = ((out + "\"karma\":") + ((this.karma.total().toString()))) + ",";
    out = ((out + "\"deaths\":") + ((this.exportDeaths().toString()))) + ",";
    out = ((out + "\"appearance\":") + ((this.playerStats.appearance.toString()))) + ",";
    out = ((out + "\"intelligence\":") + ((this.playerStats.intelligence.toString()))) + ",";
    out = ((out + "\"enemies\":") + ((this.npcRelations.countWithAngerAtLeast(75).toString()))) + ",";
    out = ((out + "\"lovers\":") + ((this.npcRelations.countWithLoveAtLeast(70).toString()))) + ",";
    out = ((out + "\"reports\":") + ((this._map.countMainTask("reporting").toString()))) + "}";
    return out;
  };
  epilogueSummaryLine () {
    let line = this._map.lastStatus;
    if ( (line.length) < 1 ) {
      line = "Päivä päättyi: " + this.gameOverReason;
    }
    line = (line + " | Karma ") + ((this.karma.total().toString()));
    line = (line + " | Vihamiehiä ") + ((this.npcRelations.countWithAngerAtLeast(75).toString()));
    line = (line + " | Rakkaudet ") + ((this.npcRelations.countWithLoveAtLeast(70).toString()));
    return line;
  };
  gameRollPercent () {
    if ( (this.simScenarioId.length) > 0 ) {
      return this.simRngNext(0, 99);
    }
    return Math.floor(Math.random()*(99 - 0 + 1) + 0);
  };
  emitWorldEvent (evt) {
    if ( evt.timeMinutes < 1 ) {
      evt.timeMinutes = this.worldClock.gameMinutes;
    }
    evt.floor = this._map.currentFloor;
    this._map.pushWorldEvent(evt);
    this.propagateEventNotices(evt);
  };
  propagateEventNotices (evt) {
    const savedFloor = this._map.currentFloor;
    this._map.currentFloor = evt.floor;
    this._map.recomputeSize();
    const floor = this._map.activeFloor();
    const ents = floor.entities;
    let ei = 0;
    const en = ents.length;
    while (ei < en) {
      const npc = ents[ei];
      if ( npc.offDuty == false ) {
        if ( npc.kind == "coworker" ) {
          this.tryNpcNoticeEvent(npc, evt);
        } else {
          if ( npc.kind == "security" ) {
            this.tryNpcNoticeEvent(npc, evt);
          } else {
            if ( npc.kind == "role" ) {
              this.tryNpcNoticeEvent(npc, evt);
            }
          }
        }
      }
      ei = ei + 1;
    };
    this._map.currentFloor = savedFloor;
    this._map.recomputeSize();
  };
  tryNpcNoticeEvent (npc, evt) {
    const rel = this.npcRelations.getOrCreate(npc.id);
    const percent = this.eventPerception.noticePercent(npc, evt, rel);
    const roll = this.gameRollPercent();
    if ( this.eventPerception.noticesWithRoll(percent, roll) == false ) {
      return;
    }
    this.onNpcNoticedEvent(npc, evt, rel);
  };
  onNpcNoticedEvent (npc, evt, rel) {
    if ( evt.playerSource ) {
      this._map.playerWasWitnessed = true;
    }
    const susDelta = (Math.floor( (evt.suspiciousness / 4))) + 1;
    rel.applyStatDelta("suspicion", susDelta);
    if ( evt.type == "PlayerFarted" ) {
      rel.applyStatDelta("respect", -10);
      rel.applyStatDelta("love", -10);
      rel.applyStatDelta("anger", 10);
      this._map.lastStatus = npc.name + " nyppi nenäänsä.";
    } else {
      if ( npc.mainTask != "reporting" ) {
        if ( npc.mainTask != "seeking_player" ) {
          npc.mainTask = "investigating";
        }
      }
      this._map.lastStatus = npc.name + " huomasi jotain epäilyttävää.";
    }
  };
  computeReportScore (npc, rel, observedSeverity) {
    let responsibility = Math.floor( (npc.persistence / 5));
    if ( responsibility < 1 ) {
      responsibility = 1;
    }
    let score = (((rel.anger * 2) + (rel.suspicion * 3)) + responsibility) + (observedSeverity * 2);
    score = score - (rel.respect * 2);
    score = score - rel.love;
    score = score - rel.friendliness;
    return score;
  };
  evaluateNpcReporting () {
    const savedFloor = this._map.currentFloor;
    let fi = 0;
    const fn = this._map.floorCount();
    while (fi < fn) {
      this._map.currentFloor = fi;
      this._map.recomputeSize();
      const floor = this._map.activeFloor();
      const ents = floor.entities;
      let ei = 0;
      const en = ents.length;
      while (ei < en) {
        const npc = ents[ei];
        if ( npc.offDuty == false ) {
          if ( (npc.id.length) > 0 ) {
            const rel = this.npcRelations.getOrCreate(npc.id);
            let observed = 0;
            const lastEvt = this._map.eventLog.lastOnFloor(fi);
            if ( (lastEvt.type.length) > 0 ) {
              observed = lastEvt.severity;
            }
            const score = this.computeReportScore(npc, rel, observed);
            if ( npc.kind == "security" ) {
              if ( score >= 40 ) {
                npc.mainTask = "seeking_player";
              }
            } else {
              if ( npc.kind == "coworker" ) {
                if ( score >= 50 ) {
                  npc.mainTask = "reporting";
                }
              }
            }
          }
        }
        ei = ei + 1;
      };
      fi = fi + 1;
    };
    this._map.currentFloor = savedFloor;
    this._map.recomputeSize();
  };
  tryPlayerFartEvent () {
    if ( this.playerNeeds.gas < 15 ) {
      return;
    }
    const roll = this.gameRollPercent();
    if ( roll >= 5 ) {
      return;
    }
    const evt = new WorldEvent();
    evt.x = this._map.playerX;
    evt.y = this._map.playerY;
    evt.timeMinutes = this.worldClock.gameMinutes;
    evt.applyPlayerFarted();
    this.emitWorldEvent(evt);
    this.playerNeeds.gas = this.playerNeeds.gas - 4;
    this.playerNeeds.clampAll();
    this._map.lastStatus = "Ilmaan lehahti epämiellyttävä haju.";
  };
  consumeWitnessFlag () {
    const witnessed = this._map.playerWasWitnessed;
    this._map.playerWasWitnessed = false;
    return witnessed;
  };
  emitMisconductEvent (eventType, x, y) {
    const evt = new WorldEvent();
    evt.x = x;
    evt.y = y;
    evt.timeMinutes = this.worldClock.gameMinutes;
    evt.playerSource = true;
    if ( eventType == "ComputerBroken" ) {
      evt.applyComputerBroken();
    } else {
      if ( eventType == "ToiletBroken" ) {
        evt.applyToiletBroken();
      } else {
        if ( eventType == "DoorBroken" ) {
          evt.applyDoorBroken();
        }
      }
    }
    this.emitWorldEvent(evt);
  };
  propagateLastBreakEvent () {
    const evt = this._map.eventLog.lastOnFloor(this._map.currentFloor);
    if ( (evt.type.length) < 1 ) {
      return;
    }
    this.propagateEventNotices(evt);
  };
  checkFiredGameOver () {
    if ( this.screen == "gameover" ) {
      return;
    }
    if ( this.screen == "epilogue" ) {
      return;
    }
    const angryCount = this.npcRelations.countWithAngerAtLeast(75);
    if ( angryCount >= 3 ) {
      this.gameOverFired();
    }
  };
  gameOverFired () {
    this._map.lastStatus = "Liian monta vihamiestä — HR potki sinut ulos.";
    this.enterEpilogue("Fired");
  };
  applyEmotionalPlayerEffects (dialogueIndex, answerIndex) {
    const dlg = this.dialogueCatalog.dialogueAt(dialogueIndex);
    if ( answerIndex < 0 ) {
      return;
    }
    if ( answerIndex >= (dlg.answers.length) ) {
      return;
    }
    const ans = dlg.answers[answerIndex];
    let i = 0;
    const n = ans.effectStats.length;
    while (i < n) {
      const target = ans.effectTargets[i];
      const stat = ans.effectStats[i];
      const delta = ans.effectDeltas[i];
      if ( target == "player" ) {
        if ( stat == "karma" ) {
          if ( delta < 0 ) {
            this.karma.loseKarma(0 - delta);
          } else {
            this.karma.add("emotional", delta);
          }
        }
        if ( stat == "alertness" ) {
          this.playerNeeds.applyStatDelta(stat, delta);
        }
        if ( stat == "satiety" ) {
          this.playerNeeds.applyStatDelta(stat, delta);
        }
        if ( stat == "thirst" ) {
          this.playerNeeds.applyStatDelta(stat, delta);
        }
        if ( stat == "gas" ) {
          this.playerNeeds.applyStatDelta(stat, delta);
        }
      }
      i = i + 1;
    };
  };
  finishEmotionalChoice (answerIndex) {
    if ( this.pendingEmotionalDialogueIndex < 0 ) {
      return;
    }
    const ent = this._map.findEntityById(this.pendingEntityId);
    const rel = this.npcRelations.getOrCreate(this.pendingEntityId);
    this.dialogueCatalog.applyAnswerToRelation(this.pendingEmotionalDialogueIndex, answerIndex, rel);
    this.applyEmotionalPlayerEffects(this.pendingEmotionalDialogueIndex, answerIndex);
    this.applyHelpAnswerEffects(ent, answerIndex, this.pendingEmotionalDialogueIndex);
    this.applyLoveFollowup(ent, rel);
    const dlg = this.dialogueCatalog.dialogueAt(this.pendingEmotionalDialogueIndex);
    if ( (this._map.lastStatus.length) < 1 ) {
      this._map.lastStatus = (this.pendingEntityName + ": ") + dlg.text;
    }
    this.pendingEmotionalDialogueIndex = -1;
    if ( this.needsEncounterQuiz() ) {
      this.encounterResult = "quiz";
      this.afterTimedAction("talk");
      this.checkFiredGameOver();
      this.markStateDirty();
      return;
    }
    this.clearEncounter();
    this.screen = "map";
    this.afterTimedAction("talk");
    this.checkFiredGameOver();
    this.markStateDirty();
  };
  actionTimeCost (actionId) {
    if ( actionId == "move" ) {
      return 1;
    }
    if ( actionId == "talk" ) {
      return 3;
    }
    if ( actionId == "quiz_answer" ) {
      return 5;
    }
    if ( actionId == "drink_coffee" ) {
      return 5;
    }
    if ( actionId == "eat" ) {
      return 15;
    }
    if ( actionId == "break_wall" ) {
      return 30;
    }
    if ( actionId == "break_door" ) {
      return 15;
    }
    return 1;
  };
  spendTime (minutes) {
    if ( minutes < 1 ) {
      return;
    }
    if ( this.screen == "gameover" ) {
      return;
    }
    this.worldClock.spendTime(minutes);
    this.playerNeeds.tickMinutes(minutes);
    this._map.tickSchedules(this.worldClock.gameMinutes);
    this.simMinutesAccum = this.simMinutesAccum + minutes;
    this.relationTickAccum = this.relationTickAccum + minutes;
    while (this.relationTickAccum >= 5) {
      this.relationTickAccum = this.relationTickAccum - 5;
      this.tickNpcRelations();
    };
    let fartMin = 0;
    while (fartMin < minutes) {
      this.tryPlayerFartEvent();
      fartMin = fartMin + 1;
    };
    if ( this.playerNeeds.satiety <= 0 ) {
      this.gameOverNeeds("Kuolit nälkään.");
      return;
    }
    if ( this.playerNeeds.thirst <= 0 ) {
      this.gameOverNeeds("Kuolit nestehukkaan.");
      return;
    }
    this.checkExhaustionStatus();
  };
  checkExhaustionStatus () {
    if ( this.playerNeeds.alertness <= 0 ) {
      if ( (this._map.lastStatus.length) < 1 ) {
        this._map.lastStatus = "Olet täysin uupunut.";
      }
    }
  };
  gameOverNeeds (reason) {
    this._map.lastStatus = reason;
    this.enterEpilogue(reason);
  };
  runAgentPass () {
    if ( this.screen != "map" ) {
      return;
    }
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
      if ( agentResult.agentGoal == "welcome_hr" ) {
        this._map.lastStatus = agentResult.name + " löysi sinut: \"Hei — pikainen HR-tervehdys!\"";
      }
      this.startEncounter(agentResult);
    }
  };
  afterTimedAction (actionId) {
    const minutes = this.actionTimeCost(actionId);
    this.spendTime(minutes);
    if ( this.screen == "gameover" ) {
      return;
    }
    this.runAgentPass();
  };
  handleAgentTick () {
    if ( this.screen != "map" ) {
      return;
    }
    this.worldClock.advance(1);
    this._map.tickSchedules(this.worldClock.gameMinutes);
    this.simMinutesAccum = this.simMinutesAccum + 1;
    this.runAgentPass();
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
      return;
    }
    const ent = this._map.entityAt(this._map.playerX, this._map.playerY);
    if ( (ent.id.length) < 1 ) {
      return;
    }
    if ( this._map.isConsumableItemEntity(ent) ) {
      const feeling = this._map.emojiFeelingForEntity(ent);
      if ( (feeling.length) > 0 ) {
        this._map.lastStatus = feeling;
      }
      if ( (ent.char.length) > 0 ) {
        this.playerNeeds.applyEmojiChar(ent.char);
      }
      this._map.consumeItemAt(this._map.playerX, this._map.playerY);
      return;
    }
    const feeling_1 = this._map.emojiFeelingForEntity(ent);
    if ( (feeling_1.length) > 0 ) {
      this._map.lastStatus = feeling_1;
      if ( (ent.char.length) > 0 ) {
        this.playerNeeds.applyEmojiChar(ent.char);
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
  clearBlockedTalk () {
    this.blockedTalkId = "";
    this.blockedTalkChar = "";
    this.blockedTalkName = "";
    this.blockedTalkKind = "";
    this.blockedTalkStoryId = "";
  };
  setBlockedTalk (ent) {
    this.blockedTalkId = ent.id;
    this.blockedTalkChar = ent.char;
    this.blockedTalkName = ent.name;
    this.blockedTalkKind = ent.kind;
    this.blockedTalkStoryId = ent.storyId;
  };
  computeFacingCell () {
    const fx = this._map.facingX;
    let fy = this._map.facingY;
    if ( fx == 0 ) {
      if ( fy == 0 ) {
        fy = 1;
      }
    }
    this.actionTargetX = this._map.playerX + fx;
    this.actionTargetY = this._map.playerY + fy;
  };
  appendToolOption (view, toolId, label) {
    view.toolIds.push(toolId);
    view.toolLabels.push(label);
  };
  clearActionTools (view) {
    let emptyIds = [];
    let emptyLabels = [];
    view.toolIds = emptyIds;
    view.toolLabels = emptyLabels;
  };
  resolveTargetAt (x, y, view) {
    view.targetId = "";
    view.targetName = "";
    this.actionTargetTile = "";
    const ent = this._map.entityAt(x, y);
    if ( (ent.id.length) > 0 ) {
      if ( ent.kind == "action" ) {
        view.targetId = ent.actionId;
        if ( (view.targetId.length) < 1 ) {
          view.targetId = ent.id;
        }
        view.targetName = ent.name;
        if ( (view.targetName.length) < 1 ) {
          view.targetName = "Kohde";
        }
        return;
      }
      if ( ent.kind != "item" ) {
        return;
      }
    }
    const tile = this._map.tileAt(x, y);
    this.actionTargetTile = tile;
    if ( tile == "K" ) {
      view.targetId = "workstation";
      view.targetName = "Työasema";
      return;
    }
    if ( tile == "L" ) {
      view.targetId = "door";
      view.targetName = "Ovi";
      return;
    }
    if ( tile == "+" ) {
      view.targetId = "shed_door";
      view.targetName = "Vajan ovi";
      return;
    }
    if ( this._map.isBreakableTile(tile, "crowbar") ) {
      view.targetId = "breakable";
      if ( tile == "#" ) {
        view.targetName = "Seinä";
      } else {
        if ( tile == "%" ) {
          view.targetName = "Kipsiseinä";
        } else {
          if ( tile == "=" ) {
            view.targetName = "Kaappi";
          } else {
            view.targetName = "Este";
          }
        }
      }
      return;
    }
    if ( this._map.isBreakableTile(tile, "shovel") ) {
      view.targetId = "breakable";
      view.targetName = "Seinä";
      return;
    }
    if ( this._map.isBreakableTile(tile, "sledgehammer") ) {
      view.targetId = "breakable";
      view.targetName = "Este";
    }
  };
  fillToolsForTarget (view, targetId, tile) {
    this.clearActionTools(view);
    if ( targetId == "workstation" ) {
      if ( this.tools.hasUsbDrive ) {
        this.appendToolOption(view, "usb_drive", "USB-tikku");
      }
      if ( this.tools.hasCrowbar ) {
        this.appendToolOption(view, "crowbar", "Vasara (sorkkarauta)");
      }
      if ( this.tools.hasShovel ) {
        this.appendToolOption(view, "shovel", "Lapio");
      }
      if ( this.tools.hasSledgehammer ) {
        this.appendToolOption(view, "sledgehammer", "Kivivasara");
      }
      return;
    }
    if ( targetId == "door" ) {
      if ( this.tools.hasCrowbar ) {
        this.appendToolOption(view, "crowbar", "Vasara (sorkkarauta)");
      }
      if ( this.tools.hasSledgehammer ) {
        this.appendToolOption(view, "sledgehammer", "Kivivasara");
      }
      return;
    }
    if ( targetId == "shed_door" ) {
      if ( this.tools.hasShedKey ) {
        this.appendToolOption(view, "shed_key", "Vajan avain");
      }
      if ( this.tools.hasCrowbar ) {
        this.appendToolOption(view, "crowbar", "Vasara (sorkkarauta)");
      }
      if ( this.tools.hasSledgehammer ) {
        this.appendToolOption(view, "sledgehammer", "Kivivasara");
      }
      return;
    }
    if ( targetId == "breakable" ) {
      if ( this.tools.hasCrowbar ) {
        if ( this._map.isBreakableTile(tile, "crowbar") ) {
          this.appendToolOption(view, "crowbar", "Vasara (sorkkarauta)");
        }
      }
      if ( this.tools.hasShovel ) {
        if ( this._map.isBreakableTile(tile, "shovel") ) {
          this.appendToolOption(view, "shovel", "Lapio");
        }
      }
      if ( this.tools.hasSledgehammer ) {
        if ( this._map.isBreakableTile(tile, "sledgehammer") ) {
          this.appendToolOption(view, "sledgehammer", "Kivivasara");
        }
      }
    }
  };
  actionToolCount (view) {
    return view.toolIds.length;
  };
  applyBreakSeverity (severity) {
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
  };
  usbContentRoll (x, y) {
    const deaths = this.exportDeaths();
    let h = ((x * 73856093) + (y * 19349663)) + (deaths * 97);
    if ( h < 0 ) {
      h = 0 - h;
    }
    return h % 8;
  };
  applyToolToTarget (toolId) {
    this.actionResultOk = false;
    this.actionResultMessage = "";
    this.actionPendingStoryId = "";
    const scratch = new ActionView();
    this.resolveTargetAt(this.actionTargetX, this.actionTargetY, scratch);
    this.actionTargetId = scratch.targetId;
    const targetId = this.actionTargetId;
    const x = this.actionTargetX;
    const y = this.actionTargetY;
    let witness = this._map.hasNearbyWitness(8, this.worldClock.gameMinutes);
    if ( targetId == "workstation" ) {
      if ( toolId == "usb_drive" ) {
        if ( this.tools.hasUsbDrive == false ) {
          this.actionResultMessage = "Sinulla ei ole USB-tikkua.";
          return false;
        }
        const roll = this.usbContentRoll(x, y);
        if ( roll == 0 ) {
          this.actionResultMessage = "USB-tikulla on vain kissavideo ja vanha palkkalista.";
        } else {
          if ( roll <= 2 ) {
            this.actionResultMessage = "Tikulla on tiimin C++-tyyliohje — hyödyllinen muistilista (+karma).";
            this.karma.add("action:usb_tip", 4);
          } else {
            if ( roll <= 4 ) {
              this.actionResultMessage = "Tikulla on linkki lyhyeen modern-cpp-intro -oppituntiin.";
              this.karma.add("action:usb_lesson", 2);
              this.actionPendingStoryId = "modern-cpp-intro";
            } else {
              this.actionResultMessage = "Tikulla on troijalainen — kone kaatuu ja IT hermostuu!";
              this._map.setTileAt(x, y, "x");
              this.karma.loseKarma(15);
              this.conduct.addMisconduct(18);
              this.emitMisconductEvent("ComputerBroken", x, y);
              if ( this.consumeWitnessFlag() ) {
                witness = true;
              }
              if ( witness ) {
                this.actionResultMessage = this.actionResultMessage + " Kollega näkee ruudun — turvallisuus hälytetään!";
                this._map.startPoliceChase();
              }
            }
          }
        }
        if ( witness ) {
          if ( roll <= 2 ) {
            if ( roll != 0 ) {
              this.actionResultMessage = this.actionResultMessage + " Kollega nyökkää hyväksyvästi.";
            }
          }
        }
        this._map.lastStatus = this.actionResultMessage;
        this.actionResultOk = true;
        return true;
      }
      if ( ((toolId == "crowbar") || (toolId == "sledgehammer")) || (toolId == "shovel") ) {
        this._map.setTileAt(x, y, "x");
        let misconduct = 12;
        let karmaLoss = 10;
        if ( toolId == "sledgehammer" ) {
          misconduct = 22;
          karmaLoss = 18;
        }
        this.karma.loseKarma(karmaLoss);
        this.conduct.addMisconduct(misconduct);
        this.emitMisconductEvent("ComputerBroken", x, y);
        if ( this.consumeWitnessFlag() ) {
          witness = true;
        }
        this.actionResultMessage = "Työkalu + työasema = huono idea. Näyttö meni ja karma laskee.";
        if ( witness ) {
          this.actionResultMessage = this.actionResultMessage + " Joku näki tämän!";
          this._map.startPoliceChase();
        }
        this._map.lastStatus = this.actionResultMessage;
        this.actionResultOk = true;
        return true;
      }
      this.actionResultMessage = "Tähän työasemaan ei voi käyttää tuota esinettä.";
      return false;
    }
    if ( (targetId == "door") || (targetId == "shed_door") ) {
      if ( toolId == "shed_key" ) {
        if ( targetId != "shed_door" ) {
          this.actionResultMessage = "Oveen ei saa tuota esinettä kiinnitettyä järkevästi.";
          return false;
        }
        if ( this.tools.hasShedKey == false ) {
          this.actionResultMessage = "Sinulla ei ole vajan avainta.";
          return false;
        }
        this._map.openTileAt(x, y);
        this.actionResultMessage = "Avain sopii — vajan ovi aukeaa.";
        this._map.lastStatus = this.actionResultMessage;
        this.actionResultOk = true;
        return true;
      }
      if ( (toolId == "crowbar") || (toolId == "sledgehammer") ) {
        this._map.openTileAt(x, y);
        this.karma.loseKarma(8);
        this.conduct.addMisconduct(10);
        this.emitMisconductEvent("DoorBroken", x, y);
        if ( this.consumeWitnessFlag() ) {
          witness = true;
        }
        this.actionResultMessage = "Murrat oven auki — melkoinen karma-tappio.";
        if ( witness ) {
          this._map.startPoliceChase();
        }
        this._map.lastStatus = this.actionResultMessage;
        this.actionResultOk = true;
        return true;
      }
      this.actionResultMessage = "Oveen ei saa tuota esinettä kiinnitettyä järkevästi.";
      return false;
    }
    if ( targetId == "breakable" ) {
      const severity = this._map.tryBreakAt(x, y, toolId, this.worldClock.gameMinutes);
      if ( (severity.length) < 1 ) {
        this.actionResultMessage = "Työkalu ei tepsi tähän esteeseen.";
        return false;
      }
      this.applyBreakSeverity(severity);
      this.propagateLastBreakEvent();
      if ( this.consumeWitnessFlag() ) {
        witness = true;
      }
      const hermit = this._map.entityAt(70, 23);
      if ( hermit.id == "staff-f7-hermit" ) {
        let dist = this._map.playerX - hermit.x;
        if ( dist < 0 ) {
          dist = 0 - dist;
        }
        let dy = this._map.playerY - hermit.y;
        if ( dy < 0 ) {
          dy = 0 - dy;
        }
        if ( (dist + dy) <= 3 ) {
          this._map.lastStatus = "Seinän takaa kuuluu kolinaa — joku on hengissä!";
        }
      }
      this.actionResultMessage = this._map.lastStatus;
      this.actionResultOk = true;
      return true;
    }
    this.actionResultMessage = "Et keksi miten yhdistää esineen ja kohteen.";
    return false;
  };
  openBlockedMenu (talkEnt) {
    this.computeFacingCell();
    const scratch = new ActionView();
    this.resolveTargetAt(this.actionTargetX, this.actionTargetY, scratch);
    this.actionTargetId = scratch.targetId;
  };
  tryOpenBlockedMenu (talkEnt) {
    this.openBlockedMenu(talkEnt);
    const scratch = new ActionView();
    this.fillToolsForTarget(scratch, this.actionTargetId, this.actionTargetTile);
    let canTalk = false;
    if ( (talkEnt.id.length) > 0 ) {
      if ( this._map.entityBlocksPlayer(talkEnt) ) {
        canTalk = true;
        this.setBlockedTalk(talkEnt);
      }
    } else {
      this.clearBlockedTalk();
    }
    const toolCount = this.actionToolCount(scratch);
    if ( canTalk == false ) {
      if ( toolCount < 1 ) {
        return false;
      }
    }
    this.actionPhase = "";
    this.screen = "blocked";
    this.markStateDirty();
    return true;
  };
  tryOpenActionPicker () {
    this.computeFacingCell();
    const scratch = new ActionView();
    this.resolveTargetAt(this.actionTargetX, this.actionTargetY, scratch);
    this.actionTargetId = scratch.targetId;
    if ( (this.actionTargetId.length) < 1 ) {
      this._map.lastStatus = "Ei kohdetta — käänny esteen, työaseman (K) tai oven (L/+) päin.";
      return false;
    }
    this.fillToolsForTarget(scratch, this.actionTargetId, this.actionTargetTile);
    if ( this.actionToolCount(scratch) < 1 ) {
      this._map.lastStatus = "Sinulla ei ole työkalua, joka toimisi tähän kohteeseen.";
      return false;
    }
    this.actionPhase = "pick";
    this.screen = "action";
    this.markStateDirty();
    return true;
  };
  getBlockedView () {
    const view = new ActionView();
    view.mode = "blocked";
    const scratch = new ActionView();
    this.resolveTargetAt(this.actionTargetX, this.actionTargetY, scratch);
    view.targetId = scratch.targetId;
    view.targetName = scratch.targetName;
    this.fillToolsForTarget(view, scratch.targetId, this.actionTargetTile);
    if ( (this.blockedTalkId.length) > 0 ) {
      view.canTalk = true;
      view.talkName = this.blockedTalkName;
    }
    const toolCount = this.actionToolCount(view);
    let choiceN = 1;
    if ( view.canTalk ) {
      view.hintLine = "1=juttele";
      choiceN = 2;
    }
    if ( toolCount > 0 ) {
      if ( (view.hintLine.length) > 0 ) {
        view.hintLine = view.hintLine + "  ";
      }
      view.hintLine = (view.hintLine + ((choiceN.toString()))) + "=käytä työkalua";
      choiceN = choiceN + 1;
    }
    view.hintLine = ((view.hintLine + "  ") + ((choiceN.toString()))) + "=peruuta";
    return view;
  };
  getActionView () {
    const view = new ActionView();
    if ( this.actionPhase == "result" ) {
      view.mode = "result";
      view.resultOk = this.actionResultOk;
      view.resultMessage = this.actionResultMessage;
      view.hintLine = "Enter=ok";
      return view;
    }
    view.mode = "pick";
    const scratch = new ActionView();
    this.resolveTargetAt(this.actionTargetX, this.actionTargetY, scratch);
    view.targetId = scratch.targetId;
    view.targetName = scratch.targetName;
    this.fillToolsForTarget(view, scratch.targetId, this.actionTargetTile);
    view.hintLine = "1–3=työkalu  4=peruuta";
    return view;
  };
  onBlockedKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    const view = this.getBlockedView();
    const toolCount = this.actionToolCount(view);
    let cancelKey = 1;
    if ( view.canTalk ) {
      cancelKey = cancelKey + 1;
    }
    if ( toolCount > 0 ) {
      cancelKey = cancelKey + 1;
    }
    const cancelCh = (cancelKey.toString());
    if ( (key == cancelCh) || (key == "4") ) {
      this.screen = "map";
      this._map.lastStatus = "Peruutit.";
      this.clearBlockedTalk();
      this.markStateDirty();
      return;
    }
    if ( view.canTalk ) {
      if ( key == "1" ) {
        const ent = new MapEntity();
        ent.id = this.blockedTalkId;
        ent.char = this.blockedTalkChar;
        ent.name = this.blockedTalkName;
        ent.kind = this.blockedTalkKind;
        ent.storyId = this.blockedTalkStoryId;
        this.clearBlockedTalk();
        this._map.playerHidden = false;
        this._map.lastStatus = "";
        this.startEncounter(ent);
        this.markStateDirty();
        return;
      }
    }
    let toolKey = 1;
    if ( view.canTalk ) {
      toolKey = 2;
    }
    if ( toolCount > 0 ) {
      const toolCh = (toolKey.toString());
      if ( key == toolCh ) {
        this.actionPhase = "pick";
        this.screen = "action";
        this.markStateDirty();
        return;
      }
    }
    this._map.lastStatus = ("Valitse " + view.hintLine) + ".";
    this.markStateDirty();
  };
  onActionKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    if ( this.actionPhase == "result" ) {
      if ( (key == "enter") || (key == " ") ) {
        this.actionPhase = "";
        if ( (this.actionPendingStoryId.length) > 0 ) {
          this.pendingStoryId = this.actionPendingStoryId;
          this.encounterResult = "action_story";
          this.actionPendingStoryId = "";
        } else {
          this.encounterResult = "";
        }
        this.screen = "map";
        this.afterPlayerAction();
        this.handleAgentTick();
        this.markStateDirty();
      }
      return;
    }
    if ( (key == "4") || (key == "esc") ) {
      this.screen = "map";
      this._map.lastStatus = "Peruutit.";
      this.actionPhase = "";
      this.clearBlockedTalk();
      this.markStateDirty();
      return;
    }
    const view = this.getActionView();
    const toolCount = this.actionToolCount(view);
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
    if ( idx < 0 ) {
      this._map.lastStatus = "Valitse työkalu numerolla tai 4 peruuttaaksesi.";
      this.markStateDirty();
      return;
    }
    if ( idx >= toolCount ) {
      this._map.lastStatus = "Valitse työkalu numerolla tai 4 peruuttaaksesi.";
      this.markStateDirty();
      return;
    }
    const toolId = view.toolIds[idx];
    this.applyToolToTarget(toolId);
    this.actionPhase = "result";
    this.clearBlockedTalk();
    this.markStateDirty();
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
        this._map.lastStatus = "Sait virallisen kulkuluvan — haastattelu meni läpi! HR odottaa sinua 2. kerroksella.";
        this.syncHrGreeter();
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
    if ( this.needsProfileSetup() ) {
      this.screen = "setup";
      return;
    }
    if ( this.screen == "setup" ) {
      return;
    }
    if ( this.screen == "prison" ) {
      this.onPrisonKey(key);
      return;
    }
    if ( this.screen == "epilogue" ) {
      this.onEpilogueKey(key);
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
    if ( this.screen == "blocked" ) {
      this.onBlockedKey(key);
      return;
    }
    if ( this.screen == "action" ) {
      this.onActionKey(key);
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
    if ( key == "e" ) {
      this.tryOpenActionPicker();
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
      const severity = this._map.tryBreakFacing(this.tools.activeTool, this.worldClock.gameMinutes);
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
        this.propagateLastBreakEvent();
        this.consumeWitnessFlag();
        const hermit = this._map.entityAt(70, 23);
        if ( hermit.id == "staff-f7-hermit" ) {
          let dist = this._map.playerX - hermit.x;
          if ( dist < 0 ) {
            dist = 0 - dist;
          }
          let dy = this._map.playerY - hermit.y;
          if ( dy < 0 ) {
            dy = 0 - dy;
          }
          if ( (dist + dy) <= 3 ) {
            this._map.lastStatus = "Seinän takaa kuuluu kolinaa — joku on hengissä!";
          }
        }
        this.afterPlayerAction();
        let breakAction = "break_door";
        if ( severity == "heavy" ) {
          breakAction = "break_wall";
        }
        this.afterTimedAction(breakAction);
      }
      this.markStateDirty();
      return;
    }
    if ( (((((((((key == "1") || (key == "2")) || (key == "3")) || (key == "4")) || (key == "5")) || (key == "6")) || (key == "7")) || (key == "8")) || (key == "9")) || (key == "0") ) {
      this.tryElevatorKey(key);
      return;
    }
    let dx = 0;
    let dy_1 = 0;
    if ( key == "up" ) {
      dy_1 = -1;
    } else {
      if ( key == "down" ) {
        dy_1 = 1;
      } else {
        if ( key == "left" ) {
          dx = -1;
        } else {
          if ( key == "right" ) {
            dx = 1;
          } else {
            if ( key == "w" ) {
              dy_1 = -1;
            } else {
              if ( key == "s" ) {
                dy_1 = 1;
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
    const targetY = this._map.playerY + dy_1;
    const moved = this.tryPlayerMove(dx, dy_1);
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
      if ( this.tryOpenBlockedMenu(blocker) ) {
        this.markStateDirty();
        return;
      }
    }
    const bump = this._map.bumpAtPlayer();
    if ( this._map.entityBlocksPlayer(bump) ) {
      if ( this.tryOpenBlockedMenu(bump) ) {
        this.markStateDirty();
        return;
      }
      this.startEncounter(bump);
    } else {
      if ( moved ) {
        this.handleAgentTick();
      }
    }
    if ( this.screen == "map" ) {
      this.checkProximityGreetings();
    }
    this.markStateDirty();
  };
  onEmotionalAnswerKey (key) {
    if ( this.screen != "encounter" ) {
      return;
    }
    if ( this.encounterResult != "emotional" ) {
      return;
    }
    if ( ((key == "leave") || (key == "p")) || (key == "3") ) {
      this._map.lastStatus = "Vetäydyt takaisin.";
      this.pendingEmotionalDialogueIndex = -1;
      this.clearEncounter();
      this.screen = "map";
      this.markStateDirty();
      return;
    }
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
    if ( idx < 0 ) {
      return;
    }
    this.finishEmotionalChoice(idx);
  };
  onEncounterChoice (choice) {
    if ( this.screen != "encounter" ) {
      return;
    }
    if ( this.encounterResult == "emotional" ) {
      this.onEmotionalAnswerKey(choice);
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
      this.applyWcTalkAngerIfNeeded();
      const ent = this._map.findEntityById(this.pendingEntityId);
      const rel = this.npcRelations.getOrCreate(this.pendingEntityId);
      if ( this.isCoworkerEncounter() ) {
        this.applyTalkLoveBump(ent, rel);
      }
      if ( this.shouldUseEmotionalDialogue(ent, rel) ) {
        this.pendingEmotionalDialogueIndex = this.dialogueCatalog.pickForEncounter(rel, ent);
        if ( this.pendingEmotionalDialogueIndex >= 0 ) {
          this.encounterResult = "emotional";
          this.markStateDirty();
          return;
        }
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
  onEpilogueKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    this._map.clearPoliceSquad();
    this.playerNeeds.resetDefaults();
    this.npcRelations.reset();
    this.dialogueCatalog.loadDefaults();
    this.relationTickAccum = 0;
    this.socialTickAccum = 0;
    this.escalatedAngry = false;
    this.escalatedPanic = false;
    this.escalatedJealous = false;
    this.gameOverReason = "";
    const floor = this._map.activeFloor();
    this._map.playerX = floor.spawnX;
    this._map.playerY = floor.spawnY;
    this._map.playerHidden = false;
    this._map.ensurePlayerOnWalkable();
    this._map.lastStatus = "Uusi päivä alkaa — muista syödä ja juoda.";
    this.screen = "map";
    this.markStateDirty();
  };
  onGameOverKey (key) {
    if ( ((((key == "q") || (key == "esc")) || (key == "ctrl-x")) || (key == "ctrl-c")) || (key == "ctrl-d") ) {
      this.shouldQuit = true;
      this.markStateDirty();
      return;
    }
    this._map.clearPoliceSquad();
    let respawnMsg = "Selvitit hengissä — mutta poliisit muistavat kasvosi.";
    if ( (this.gameOverReason.length) > 0 ) {
      respawnMsg = "Heräsit toimiston alkuun — muista syödä ja juoda.";
      this.playerNeeds.resetDefaults();
      this.npcRelations.reset();
      this.dialogueCatalog.loadDefaults();
      this.relationTickAccum = 0;
      this.gameOverReason = "";
    }
    const floor = this._map.activeFloor();
    this._map.playerX = floor.spawnX;
    this._map.playerY = floor.spawnY;
    this._map.playerHidden = false;
    this._map.ensurePlayerOnWalkable();
    this._map.lastStatus = respawnMsg;
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
    view.attackWarning = "";
    if ( this.encounterResult == "emotional" ) {
      view.isEmotional = true;
      const dlg = this.dialogueCatalog.dialogueAt(this.pendingEmotionalDialogueIndex);
      view.emotionalQuestion = dlg.text;
      let emptyAnswers = [];
      view.emotionalAnswers = emptyAnswers;
      const ac = this.dialogueCatalog.answerCount(this.pendingEmotionalDialogueIndex);
      let ai = 0;
      while (ai < ac) {
        view.emotionalAnswers.push(this.dialogueCatalog.answerText(this.pendingEmotionalDialogueIndex, ai));
        ai = ai + 1;
      };
      view.hintLine = "1–3=vastaa  p=poistu";
      return view;
    }
    if ( this.needsEncounterQuiz() ) {
      view.hintLine = "1–4=vastaa  n=kollega  a=AI  j=vitsi  i=ei kiinnosta  p=poistu";
    } else {
      view.hintLine = "1=juttele  2=vitsi  3=poistu";
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
    view.needsLine = this.playerNeeds.formatLine();
    view.ambientLine = this._map.overheardMsg;
    if ( this.screen == "epilogue" ) {
      view.statusLine = this.epilogueSummaryLine();
    }
    return view;
  };
  simEpilogueJson () {
    return this.buildEpilogueJson();
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
  simRngNext (min, max) {
    this.simRngState = (this.simRngState * 1103515245) + 12345;
    if ( this.simRngState < 0 ) {
      this.simRngState = 0 - this.simRngState;
    }
    const span = (max - min) + 1;
    if ( span < 1 ) {
      return min;
    }
    let pick = this.simRngState % span;
    if ( pick < 0 ) {
      pick = 0 - pick;
    }
    return min + pick;
  };
  simClearReport () {
    this.simScenarioId = "";
    this.simOutcome = "running";
    this.simStepCount = 0;
    this.simMinutesAccum = 0;
    let emptyTypes = [];
    let emptyDetails = [];
    let emptyErrors = [];
    this.simEventTypes = emptyTypes;
    this.simEventDetails = emptyDetails;
    this.simErrors = emptyErrors;
  };
  simLogEvent (etype, detail) {
    this.simEventTypes.push(etype);
    this.simEventDetails.push(detail);
  };
  simLogError (msg) {
    this.simErrors.push(msg);
    this.simOutcome = "error";
  };
  simEscapeJson (raw) {
    let out = "";
    let i = 0;
    const n = raw.length;
    while (i < n) {
      const ch = raw.substring(i, (i + 1) );
      if ( ch == "\"" ) {
        out = out + "\\\"";
      } else {
        if ( ch == "\\" ) {
          out = out + "\\\\";
        } else {
          out = out + ch;
        }
      }
      i = i + 1;
    };
    return out;
  };
  simFieldObj (root, key) {
    const opt = (root[key] instanceof Object ) ? root [key] : undefined ;
    if ( typeof(opt) === "undefined" ) {
      const blank = root;
      return blank;
    }
    return opt;
  };
  simGrantTools (arr) {
    let i = 0;
    const n = arr.length;
    while (i < n) {
      const toolObj = this.simJson.arrayObjectAt(arr, i);
      let toolId = this.simJson.objFieldStr(toolObj, "id");
      if ( (toolId.length) < 1 ) {
        toolId = this.simJson.objFieldStr(toolObj, "tool");
      }
      if ( (toolId.length) > 0 ) {
        this.tools.grant(toolId);
      }
      i = i + 1;
    };
  };
  simBootstrap (setupJson, worldJson) {
    this.simClearReport();
    try {
      const setupOpt = JSON.parse(setupJson);
      if ( typeof(setupOpt) === "undefined" ) {
        this.simLogError("bad setup json");
        return;
      }
      const setup = setupOpt;
      let scenarioId = this.simJson.objFieldStr(setup, "id");
      if ( (scenarioId.length) < 1 ) {
        scenarioId = "unnamed";
      }
      this.simScenarioId = scenarioId;
      let seed = this.simJson.objFieldInt(setup, "seed");
      if ( seed < 1 ) {
        seed = 1;
      }
      this.simSeed = seed;
      this.simRngState = seed;
      const ok = this.loadMapFromText(worldJson);
      if ( ok == false ) {
        this.simLogError("world load failed");
        return;
      }
      this.applyScenarioSetup(setup);
      this.simLogEvent("bootstrap", scenarioId);
      this.markStateDirty();
    } catch(e) {
      this.simLogError("bad setup json");
    }
  };
  applyScenarioSetup (setup) {
    const clockMinutes = this.simJson.objFieldInt(setup, "clockMinutes");
    if ( clockMinutes > 0 ) {
      this.worldClock.setGameMinutes(clockMinutes);
    }
    const bootKarma = this.simJson.objFieldInt(setup, "bootKarma");
    if ( bootKarma > 0 ) {
      this.karma.add("sim:boot", bootKarma);
    }
    const progress = this.simFieldObj(setup, "progress");
    this.interviewPassed = this.simJson.objFieldBool(progress, "interviewPassed");
    this.interviewFailed = this.simJson.objFieldBool(progress, "interviewFailed");
    this.guruIntroPassed = this.simJson.objFieldBool(progress, "guruIntroPassed");
    this.guruStoryAttempted = this.simJson.objFieldBool(progress, "guruStoryAttempted");
    this.guruQuizCorrect = this.simJson.objFieldInt(progress, "guruQuizCorrect");
    this.hrWelcomeDone = this.simJson.objFieldBool(progress, "hrWelcomeDone");
    const player = this.simFieldObj(setup, "player");
    const floor = this.simJson.objFieldInt(player, "floor");
    const floorCount = this._map.floorCount();
    if ( floor >= 0 ) {
      if ( floor < floorCount ) {
        this._map.currentFloor = floor;
        this._map.recomputeSize();
      }
    }
    const fl = this._map.activeFloor();
    const px = this.simJson.objFieldInt(player, "x");
    const py = this.simJson.objFieldInt(player, "y");
    if ( px > 0 ) {
      this._map.playerX = px;
    } else {
      this._map.playerX = fl.spawnX;
    }
    if ( py > 0 ) {
      this._map.playerY = py;
    } else {
      this._map.playerY = fl.spawnY;
    }
    if ( this.simJson.objFieldBool(player, "hidden") ) {
      this._map.playerHidden = true;
    } else {
      this._map.playerHidden = false;
    }
    const toolsOpt = (setup["tools"] instanceof Array ) ? setup ["tools"] : undefined ;
    if ( typeof(toolsOpt) === "undefined" ) {
      const toolOne = this.simJson.objFieldStr(setup, "tool");
      if ( (toolOne.length) > 0 ) {
        this.tools.grant(toolOne);
      }
    } else {
      this.simGrantTools(toolsOpt);
    }
    this._map.ensurePlayerOnWalkable();
    this._map.tickSchedules(this.worldClock.gameMinutes);
    const needsObj = this.simFieldObj(setup, "needs");
    const needSatiety = this.simJson.objFieldInt(needsObj, "satiety");
    if ( needSatiety > 0 ) {
      this.playerNeeds.satiety = needSatiety;
    }
    const needThirst = this.simJson.objFieldInt(needsObj, "thirst");
    if ( needThirst > 0 ) {
      this.playerNeeds.thirst = needThirst;
    }
    const needAlertness = this.simJson.objFieldInt(needsObj, "alertness");
    if ( needAlertness > 0 ) {
      this.playerNeeds.alertness = needAlertness;
    }
    const needGas = this.simJson.objFieldInt(needsObj, "gas");
    if ( needGas > 0 ) {
      this.playerNeeds.gas = needGas;
    }
    this.playerNeeds.clampAll();
    const relationsOpt = (setup["relations"] instanceof Array ) ? setup ["relations"] : undefined ;
    if ( typeof(relationsOpt) === "undefined" ) {
      const relOne = this.simFieldObj(setup, "relation");
      const relNpcId = this.simJson.objFieldStr(relOne, "npcId");
      if ( (relNpcId.length) > 0 ) {
        const rel = this.npcRelations.getOrCreate(relNpcId);
        const angerVal = this.simJson.objFieldInt(relOne, "anger");
        if ( angerVal > 0 ) {
          rel.setStat("anger", angerVal);
        }
        const respectVal = this.simJson.objFieldInt(relOne, "respect");
        if ( respectVal > 0 ) {
          rel.setStat("respect", respectVal);
        }
        const suspicionVal = this.simJson.objFieldInt(relOne, "suspicion");
        if ( suspicionVal > 0 ) {
          rel.setStat("suspicion", suspicionVal);
        }
        const friendlinessVal = this.simJson.objFieldInt(relOne, "friendliness");
        if ( friendlinessVal > 0 ) {
          rel.setStat("friendliness", friendlinessVal);
        }
        const loveVal = this.simJson.objFieldInt(relOne, "love");
        if ( loveVal > 0 ) {
          rel.setStat("love", loveVal);
        }
      }
    } else {
      const relations = relationsOpt;
      let ri = 0;
      const rn = relations.length;
      while (ri < rn) {
        const relObj = this.simJson.arrayObjectAt(relations, ri);
        const relNpcId_1 = this.simJson.objFieldStr(relObj, "npcId");
        if ( (relNpcId_1.length) > 0 ) {
          const rel_1 = this.npcRelations.getOrCreate(relNpcId_1);
          const angerVal_1 = this.simJson.objFieldInt(relObj, "anger");
          if ( angerVal_1 > 0 ) {
            rel_1.setStat("anger", angerVal_1);
          }
          const respectVal_1 = this.simJson.objFieldInt(relObj, "respect");
          if ( respectVal_1 > 0 ) {
            rel_1.setStat("respect", respectVal_1);
          }
          const suspicionVal_1 = this.simJson.objFieldInt(relObj, "suspicion");
          if ( suspicionVal_1 > 0 ) {
            rel_1.setStat("suspicion", suspicionVal_1);
          }
          const friendlinessVal_1 = this.simJson.objFieldInt(relObj, "friendliness");
          if ( friendlinessVal_1 > 0 ) {
            rel_1.setStat("friendliness", friendlinessVal_1);
          }
          const loveVal_1 = this.simJson.objFieldInt(relObj, "love");
          if ( loveVal_1 > 0 ) {
            rel_1.setStat("love", loveVal_1);
          }
        }
        ri = ri + 1;
      };
    }
    const npcTasksOpt = (setup["npcTasks"] instanceof Array ) ? setup ["npcTasks"] : undefined ;
    if ( typeof(npcTasksOpt) === "undefined" ) {
      const taskOne = this.simFieldObj(setup, "npcTask");
      const taskNpcId = this.simJson.objFieldStr(taskOne, "id");
      const taskName = this.simJson.objFieldStr(taskOne, "mainTask");
      if ( (taskNpcId.length) > 0 ) {
        if ( (taskName.length) > 0 ) {
          const ent = this._map.findEntityById(taskNpcId);
          if ( (ent.id.length) > 0 ) {
            ent.mainTask = taskName;
          }
        }
      }
    } else {
      const npcTasks = npcTasksOpt;
      let ti = 0;
      const tn = npcTasks.length;
      while (ti < tn) {
        const taskObj = this.simJson.arrayObjectAt(npcTasks, ti);
        const taskNpcId_1 = this.simJson.objFieldStr(taskObj, "id");
        const taskName_1 = this.simJson.objFieldStr(taskObj, "mainTask");
        if ( (taskNpcId_1.length) > 0 ) {
          if ( (taskName_1.length) > 0 ) {
            const ent_1 = this._map.findEntityById(taskNpcId_1);
            if ( (ent_1.id.length) > 0 ) {
              ent_1.mainTask = taskName_1;
            }
          }
        }
        ti = ti + 1;
      };
    }
    const skipProfile = this.simJson.objFieldBool(setup, "skipProfile");
    if ( skipProfile == false ) {
      let simPlayerName = this.simJson.objFieldStr(player, "name");
      if ( (simPlayerName.length) < 1 ) {
        simPlayerName = "Larry";
      }
      let simSpecialty = this.simJson.objFieldStr(player, "specialty");
      if ( (simSpecialty.length) < 1 ) {
        simSpecialty = "cpp";
      }
      this.applyPlayerProfile(simPlayerName, simSpecialty);
    }
    this.syncHrGreeter();
    this._map.lastStatus = "";
    this._map.overheardMsg = "";
  };
  simTick (minutes) {
    if ( minutes < 1 ) {
      return;
    }
    this.spendTime(minutes);
    this.simStepCount = this.simStepCount + 1;
    this.simLogEvent("tick", (minutes.toString()));
    this.markStateDirty();
  };
  simStep (actionJson) {
    try {
      const actionOpt = JSON.parse(actionJson);
      if ( typeof(actionOpt) === "undefined" ) {
        this.simLogError("bad action json");
        return;
      }
      const action = actionOpt;
      const tickMin = this.simJson.objFieldInt(action, "tick");
      if ( tickMin > 0 ) {
        this.simTick(tickMin);
        return;
      }
      const moveKey = this.simJson.objFieldStr(action, "move");
      if ( (moveKey.length) > 0 ) {
        this.onMapKey(moveKey);
        this.simStepCount = this.simStepCount + 1;
        this.simLogEvent("move", moveKey);
        this.markStateDirty();
        return;
      }
      const key = this.simJson.objFieldStr(action, "key");
      if ( (key.length) > 0 ) {
        this.onMapKey(key);
        this.simStepCount = this.simStepCount + 1;
        this.simLogEvent("key", key);
        this.markStateDirty();
        return;
      }
      this.simLogError("unknown sim action");
    } catch(e) {
      this.simLogError("bad action json");
    }
  };
  simSnapshotJson () {
    const view = this.getMapView();
    const onElev = this._map.isOnElevator();
    let out = "{";
    out = ((out + "\"screen\":\"") + this.screen) + "\",";
    out = ((out + "\"floor\":") + ((this._map.currentFloor.toString()))) + ",";
    out = ((((out + "\"player\":{\"x\":") + ((this._map.playerX.toString()))) + ",\"y\":") + ((this._map.playerY.toString()))) + ",\"hidden\":";
    if ( this._map.playerHidden ) {
      out = out + "true},";
    } else {
      out = out + "false},";
    }
    out = ((out + "\"clockMinutes\":") + ((this.worldClock.gameMinutes.toString()))) + ",";
    out = ((((((((out + "\"needs\":{\"satiety\":") + ((this.playerNeeds.satiety.toString()))) + ",\"thirst\":") + ((this.playerNeeds.thirst.toString()))) + ",\"alertness\":") + ((this.playerNeeds.alertness.toString()))) + ",\"gas\":") + ((this.playerNeeds.gas.toString()))) + "},";
    out = ((out + "\"clockLine\":\"") + this.simEscapeJson(view.timeLine)) + "\",";
    out = ((out + "\"status\":\"") + this.simEscapeJson(view.statusLine)) + "\",";
    out = ((out + "\"ambient\":\"") + this.simEscapeJson(view.ambientLine)) + "\",";
    const karmaTotal = this.karma.total();
    out = ((out + "\"karma\":") + ((karmaTotal.toString()))) + ",";
    out = ((out + "\"rngSeed\":") + ((this.simSeed.toString()))) + ",";
    out = ((out + "\"simSteps\":") + ((this.simStepCount.toString()))) + ",";
    out = ((out + "\"simMinutes\":") + ((this.simMinutesAccum.toString()))) + ",";
    out = out + "\"onElevator\":";
    if ( onElev ) {
      out = out + "true,";
    } else {
      out = out + "false,";
    }
    out = out + "\"interviewPassed\":";
    if ( this.interviewPassed ) {
      out = out + "true";
    } else {
      out = out + "false";
    }
    out = out + "}";
    return out;
  };
  simDebugRelationsJson () {
    let out = "{\"relations\":[";
    let i = 0;
    const n = this.npcRelations.npcIds.length;
    while (i < n) {
      if ( i > 0 ) {
        out = out + ",";
      }
      const npcId = this.npcRelations.npcIds[i];
      const rel = this.npcRelations.relations[i];
      out = ((out + "{\"npcId\":\"") + this.simEscapeJson(npcId)) + "\",";
      out = ((out + "\"anger\":") + ((rel.anger.toString()))) + ",";
      out = ((out + "\"respect\":") + ((rel.respect.toString()))) + ",";
      out = ((out + "\"friendliness\":") + ((rel.friendliness.toString()))) + ",";
      out = ((out + "\"love\":") + ((rel.love.toString()))) + ",";
      out = ((out + "\"jealousy\":") + ((rel.jealousy.toString()))) + ",";
      out = ((out + "\"fear\":") + ((rel.fear.toString()))) + ",";
      out = ((out + "\"suspicion\":") + ((rel.suspicion.toString()))) + ",";
      out = ((out + "\"followTendency\":") + ((rel.followTendency.toString()))) + ",";
      out = ((out + "\"panic\":") + ((rel.panic.toString()))) + ",";
      out = ((out + "\"stress\":") + ((rel.stress.toString()))) + ",";
      out = ((out + "\"embarrassment\":") + ((rel.embarrassment.toString()))) + "}";
      i = i + 1;
    };
    out = out + "]}";
    return out;
  };
  simDebugEventsJson () {
    let out = "{\"events\":[";
    let i = 0;
    const n = (this._map.eventLog).count();
    while (i < n) {
      if ( i > 0 ) {
        out = out + ",";
      }
      const evt = (this._map.eventLog).at(i);
      out = ((out + "{\"type\":\"") + this.simEscapeJson(evt.type)) + "\",";
      out = ((out + "\"floor\":") + ((evt.floor.toString()))) + ",";
      out = ((out + "\"x\":") + ((evt.x.toString()))) + ",";
      out = ((out + "\"y\":") + ((evt.y.toString()))) + ",";
      out = ((out + "\"timeMinutes\":") + ((evt.timeMinutes.toString()))) + ",";
      out = ((out + "\"noise\":") + ((evt.noise.toString()))) + ",";
      out = ((out + "\"visibility\":") + ((evt.visibility.toString()))) + ",";
      out = ((out + "\"severity\":") + ((evt.severity.toString()))) + ",";
      out = ((out + "\"suspiciousness\":") + ((evt.suspiciousness.toString()))) + "}";
      i = i + 1;
    };
    out = out + "]}";
    return out;
  };
  simReportJson () {
    if ( this.simOutcome == "running" ) {
      this.simOutcome = "pass";
    }
    let out = "{";
    out = ((out + "\"scenarioId\":\"") + this.simEscapeJson(this.simScenarioId)) + "\",";
    out = ((out + "\"outcome\":\"") + this.simOutcome) + "\",";
    out = ((out + "\"steps\":") + ((this.simStepCount.toString()))) + ",";
    out = ((out + "\"simMinutes\":") + ((this.simMinutesAccum.toString()))) + ",";
    out = ((out + "\"rngSeed\":") + ((this.simSeed.toString()))) + ",";
    out = out + "\"eventLog\":[";
    let i = 0;
    const n = this.simEventTypes.length;
    while (i < n) {
      if ( i > 0 ) {
        out = out + ",";
      }
      out = ((((((out + "{\"step\":") + ((i.toString()))) + ",\"type\":\"") + this.simEscapeJson((this.simEventTypes[i]))) + "\",\"detail\":\"") + this.simEscapeJson((this.simEventDetails[i]))) + "\"}";
      i = i + 1;
    };
    out = out + "],\"errors\":[";
    let ei = 0;
    const en = this.simErrors.length;
    while (ei < en) {
      if ( ei > 0 ) {
        out = out + ",";
      }
      out = ((out + "\"") + this.simEscapeJson((this.simErrors[ei]))) + "\"";
      ei = ei + 1;
    };
    out = out + "]}";
    return out;
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
module.exports.NpcRelation = NpcRelation;
module.exports.WorldEvent = WorldEvent;
module.exports.WorldEventLog = WorldEventLog;
module.exports.WorldMap = WorldMap;
module.exports.PlayerConduct = PlayerConduct;
module.exports.PlayerTools = PlayerTools;
module.exports.InventoryView = InventoryView;
module.exports.ActionView = ActionView;
module.exports.PlayerNeeds = PlayerNeeds;
module.exports.PlayerCoreStats = PlayerCoreStats;
module.exports.NpcRelationStore = NpcRelationStore;
module.exports.EmotionMath = EmotionMath;
module.exports.EmotionalAnswer = EmotionalAnswer;
module.exports.EmotionalDialogue = EmotionalDialogue;
module.exports.DialogueCatalog = DialogueCatalog;
module.exports.ProximityGreeting = ProximityGreeting;
module.exports.WorldClock = WorldClock;
module.exports.EventPerception = EventPerception;
module.exports.Escalation = Escalation;
module.exports.GameSession = GameSession;
module.exports.KoodisampoAppRoot = KoodisampoAppRoot;
module.exports.KoodisampoLib = KoodisampoLib;
module.exports.GameSession__Registry = GameSession__Registry;
module.exports.KoodisampoAppRoot__Registry = KoodisampoAppRoot__Registry;
