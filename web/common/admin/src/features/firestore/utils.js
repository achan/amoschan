const flatten = require("lodash.flatten")

const upsert = (doc, values) => {
  return doc.exists ? doc.ref.update(values) : doc.ref.set(values)
}

const getAllDocs = async (query, startAfter = null) => {
  let snapshot
  let docs = []

  do {
    let ref = query.limit(100)

    if (startAfter) {
      ref = ref.startAfter(startAfter)
    }

    snapshot = await ref.get()
    docs = docs.concat(snapshot.docs)
    console.log({ current: snapshot.docs.length, docs: docs.length })
  } while ((startAfter = snapshot.docs[snapshot.docs.length - 1]))

  return flatten(docs)
}

module.exports = {
  upsert,
  getAllDocs,
}
