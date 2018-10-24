function Supersede () {
    this._root = {}
    this._root[''] = this._root
}

Supersede.prototype.set = function (path, value) {
    var node = this._root

    for (var i = 0, I = path.length; i < I; i++) {
        if (!node[path[i]]) {
            node[path[i]] = {}
        }
        node = node[path[i]]
    }

    node['.value'] = value

    return value
}

Supersede.prototype.remove = function (path, value) {
    var node = this._root, parent

    for (var i = 0, I = path.length; i < I; i++) {
        if (!node[path[i]]) {
            return
        }
        parent = node
        node = node[path[i]]
    }

    if ('.value' in node) {
        delete node['.value']
        if (I > 1 && Object.keys(node).length == 0) {
            delete parent[path[I - 1]]
        }
    }
}

Supersede.prototype.get = function (path) {
    var node = this._root, i = 0, value
    do {
        value = node['.value'] == null ? value : node['.value']
        node = node[path[i++]]
    } while (node)
    return value
}

Supersede.prototype.gather = function (path) {
    var node = this._root, i = 0, array = []
    for (;;) {
        node = node[path[i++]]
        if (node == null) {
            break
        }
        if (node['.value'] != null) {
            array.push(node['.value'])
        }
    }
    return array
}

module.exports = Supersede
