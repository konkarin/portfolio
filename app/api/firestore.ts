import firebase from '../plugins/firebase'
import { Order } from '../types/firebase'

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
   * 指定したクエリでドキュメントを取得
   * @param collectionPath
   * @param queries
   * @param order
   */
  async getOrderDocsByQueries(
    collectionPath: string,
    queries: Queries,
    order: Order
  ) {
    const snap = await this.db
      .collection(collectionPath)
      .where(queries.fieldPath, queries.filterStr, queries.value)
      .orderBy(order.fieldPath, order.direction)
      .limit(order.limit)
      .get()

    return snap.docs.map((doc) => doc.data())
  }

  /**
   * 指定したクエリでドキュメントを取得
   * @param collectionPath
   * @param queries1
   * @param queries2
   * @param order
   */
  async getDocsByCompoundQueries(
    collectionPath: string,
    queries1: Queries,
    queries2: Queries,
    order?: Order
  ) {
    const collectionRef = this.db
      .collection(collectionPath)
      .where(queries1.fieldPath, queries1.filterStr, queries1.value)
      .where(queries2.fieldPath, queries2.filterStr, queries2.value)

    if (order != null) {
      const snap = await collectionRef
        .orderBy(order.fieldPath, order.direction)
        .limit(order.limit)
        .get()
      return snap.docs.map((doc) => doc.data())
    } else {
      const snap = await collectionRef.get()
      return snap.docs.map((doc) => doc.data())
    }
  }

  /**
   * 指定したドキュメントIDを更新
   * @param path
   * @param docId
   * @param data
   */
  async updateDoc(path: string, docId: string, data: any) {
    // update()は新規作成できないためset
    await this.db
      .collection(path)
      .doc(docId)
      .set(data)
      .catch((e) => {
        throw new Error(e)
      })
  }

  async deleteDoc(path: string, docId: string) {
    await this.db
      .collection(path)
      .doc(docId)
      .delete()
      .catch((e) => {
        throw new Error(e)
      })
  }
}
