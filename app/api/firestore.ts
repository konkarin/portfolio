import firebase from '@/plugins/firebase'

type Queries = {
  filePath: string
  opStr: firebase.firestore.WhereFilterOp
  value: any
}

export default class Firestore {
  private db = firebase.firestore()

  async getDocById(collectionPath: string, docId: string) {
    return await this.db.collection(collectionPath).doc(docId).get()
  }

  async getDocByQueries(collectionPath: string, queries: Queries) {
    return await this.db
      .collection(collectionPath)
      .where(queries.filePath, queries.opStr, queries.value)
      .get()
  }
}
