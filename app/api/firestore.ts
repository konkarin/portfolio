import firebase from '../plugins/firebase'

export interface Queries {
  fieldPath: string
  filterStr: firebase.firestore.WhereFilterOp
  value: any
}

export type OrderByDirection = firebase.firestore.OrderByDirection

export type FieldValue = firebase.firestore.FieldValue

export default class Firestore {
  private db = firebase.firestore()

  /**
   * Firestoreのサーバータイムスタンプを取得
   */
  getTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  /**
   * コレクション内のすべてのドキュメントIDを取得する
   * @param collectionPath
   * @returns
   */
  async getDocIds(collectionPath) {
    const snap = await this.db.collection(collectionPath).get()

    return snap.docs.map((doc) => doc.id)
  }

  /**
   * コレクション内のすべてのドキュメントを取得
   * @param collectionPath
   */
  async getDocs(collectionPath: string) {
    const snap = await this.db.collection(collectionPath).get()

    return snap.docs.map((doc) => doc.data())
  }

  /**
   * 指定した数の並べ替えたドキュメントを取得
   * @param collectionPath
   * @param fieldPath
   * @param direction
   * @param limit
   */
  async getOrderDocs(
    collectionPath: string,
    fieldPath: string,
    direction?: OrderByDirection,
    limit?: number
  ) {
    const snap = await this.db
      .collection(collectionPath)
      .orderBy(fieldPath, direction)
      .limit(limit)
      .get()

    return snap.docs.map((doc) => doc.data())
  }

  /**
   * 指定したドキュメントIDを取得
   * @param collectionPath
   * @param docId
   */
  async getDocById(collectionPath: string, docId: string) {
    const snap = await this.db.collection(collectionPath).doc(docId).get()

    return snap.data()
  }

  /**
   * 指定したクエリでドキュメントを取得
   * @param collectionPath
   * @param queries
   */
  async getDocsByQueries(collectionPath: string, queries: Queries) {
    const snap = await this.db
      .collection(collectionPath)
      .where(queries.fieldPath, queries.filterStr, queries.value)
      .get()

    return snap.docs.map((doc) => doc.data())
  }

  /**
   * 指定したドキュメントIDを更新
   * @param path
   * @param docId
   * @param data
   */
  async updateDoc(path: string, docId: string, data: any) {
    // update()は新規作成できないためset
    await this.db.collection(path).doc(docId).set(data)
  }
}
