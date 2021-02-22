import firebase from '@/plugins/firebase'

type Queries = {
  filePath: string
  opStr: firebase.firestore.WhereFilterOp
  value: any
}

export default class Firestore {
  private db = firebase.firestore()

  async getDocs(collectionPath: string) {
    const snap = await this.db.collection(collectionPath).get()

    return snap.docs.map((doc) => doc.data())
  }

  async getDocById(collectionPath: string, docId: string) {
    const snap = await this.db.collection(collectionPath).doc(docId).get()

    return snap.data()
  }

  async getDocByQueries(collectionPath: string, queries: Queries) {
    const snap = await this.db
      .collection(collectionPath)
      .where(queries.filePath, queries.opStr, queries.value)
      .get()

    return snap.docs.map((doc) => doc.data())
  }

  async updateDoc(path: string, docId: string, data: any) {
    await this.db.collection(path).doc(docId).set(data)
  }
}
