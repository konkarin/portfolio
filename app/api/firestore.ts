import firebase from '@/plugins/firebase'

export interface Queries {
  fieldPath: string
  filterStr: firebase.firestore.WhereFilterOp
  value: any
}

export type OrderByDirection = firebase.firestore.OrderByDirection

export type FieldValue = firebase.firestore.FieldValue

export default class Firestore {
  private db = firebase.firestore()

  getTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  async getDocs(collectionPath: string) {
    const snap = await this.db.collection(collectionPath).get()

    return snap.docs.map((doc) => doc.data())
  }

  async getOrderDocs(
    collectionPath: string,
    fieldPath: string,
    direction?: OrderByDirection
  ) {
    const snap = await this.db
      .collection(collectionPath)
      .orderBy(fieldPath, direction)
      .get()

    return snap.docs.map((doc) => doc.data())
  }

  async getDocById(collectionPath: string, docId: string) {
    const snap = await this.db.collection(collectionPath).doc(docId).get()

    return snap.data()
  }

  async getDocByQueries(collectionPath: string, queries: Queries) {
    const snap = await this.db
      .collection(collectionPath)
      .where(queries.fieldPath, queries.filterStr, queries.value)
      .get()

    return snap.docs.map((doc) => doc.data())
  }

  async updateDoc(path: string, docId: string, data: any) {
    await this.db.collection(path).doc(docId).set(data)
  }
}
