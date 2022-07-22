import firebase from 'firebase/app'

export type DocumentData = firebase.firestore.DocumentData

export type FirebaseUser = firebase.User

export type OrderByDirection = firebase.firestore.OrderByDirection

export type Timestamp = firebase.firestore.Timestamp

export type FieldValue = firebase.firestore.FieldValue

export interface Queries {
  fieldPath: string
  filterStr: firebase.firestore.WhereFilterOp
  value: any
}

export interface Order {
  fieldPath: string
  direction?: OrderByDirection
  limit?: number
}
