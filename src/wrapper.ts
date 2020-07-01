export interface FieldValue {
  serverTimestamp(): FieldValue;

  delete(): FieldValue;

  increment(n: number): FieldValue;

  arrayUnion(...elements: any[]): FieldValue;

  arrayRemove(...elements: any[]): FieldValue;

  isEqual(other: FieldValue): boolean;
}

export interface WriteResult {
  readonly writeTime: string;

  isEqual(other: WriteResult): boolean;
}

export interface WriteBatch<T> {
  create<K>(documentRef: DocumentReference<K>, data: K): WriteBatch<K>;

  set<K>(documentRef: DocumentReference<K>, data: K, options?: SetOptions): WriteBatch<K>;

  update<K>(documentRef: DocumentReference<K>, data: Partial<K>, precondition?: string): WriteBatch<K>;

  update<K>(
    documentRef: DocumentReference<K>,
    field: string,
    value: any,
    ...fieldsOrPrecondition: any[]
  ): WriteBatch<K>;

  delete<K>(documentRef: DocumentReference<K>, precondition?: string): WriteBatch<K>;

  commit(): Promise<WriteResult[]>;
}

export interface SetOptions {
  readonly merge?: boolean;
  readonly mergeFields?: string[];
}

export interface Transaction<T> {
  get(): Promise<any>;

  get<K>(documentRef: DocumentReference<K>): Promise<DocumentSnapshot<K>>;

  get<K>(query: Query<K>): Promise<QuerySnapshot<K>>;

  getAll<K>(...documentRefsOrReadOptions: Array<DocumentReference<K>>): Promise<DocumentSnapshot<K>[]>;

  create<K>(documentRef: DocumentReference<K>, data: K): Transaction<K>;

  set<K>(documentRef: DocumentReference<K>, data: K, options?: SetOptions): Transaction<K>;

  update<K>(documentRef: DocumentReference<K>, data: Partial<K>, precondition?: string): Transaction<K>;

  // update<K>(documentRef: DocumentReference<K>, field: string, value: any,
  //     ...fieldsOrPrecondition: any[]): Transaction<K>;

  delete<K>(documentRef: DocumentReference<K>, precondition?: string): Transaction<K>;
}

export interface DocumentSnapshot<T> {
  exists: boolean;
  ref: DocumentReference<T>;
  id: string;
  // createTime?: Timestamp;
  // updateTime?: Timestamp;
  // readTime: Timestamp;
  data(): T | undefined;
  get(fieldPath: string): any;
  isEqual(other: DocumentSnapshot<T>): boolean;
}

export interface QueryDocumentSnapshot<T> extends DocumentSnapshot<T> {
  data<K extends keyof T>(): T[K];
  data(): any;
}

export interface QuerySnapshot<T> {
  size: number;
  query: Query<T>;
  empty: boolean;
  docs: QueryDocumentSnapshot<T>[];
  // docChanges(): DocumentChange[];
  forEach(callback: (result: QueryDocumentSnapshot<T>) => void, thisArg?: any): void;
  isEqual(other: QuerySnapshot<T>): boolean;
}

export interface Query<T> {
  where<K extends keyof T>(
    fieldPath: keyof T[K] | string,
    opStr: '<' | '<=' | '==' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any',
    value: any,
  ): Query<T>;
  orderBy<K extends keyof T>(fieldPath: keyof T[K], directionStr?: 'desc' | 'asc'): Query<T>;
  limit(limit: number): Query<T>;
  offset(offset: number): Query<T>;
  select(...field: string[]): Query<T>;
  startAt(snapshot: DocumentSnapshot<T>): Query<T>;
  startAt(...fieldValues: any[]): Query<T>;
  startAfter(snapshot: DocumentSnapshot<T>): Query<T>;
  startAfter(...fieldValues: any[]): Query<T>;
  endBefore(snapshot: DocumentSnapshot<T>): Query<T>;
  endBefore(...fieldValues: any[]): Query<T>;
  endAt(snapshot: DocumentSnapshot<T>): Query<T>;
  endAt(...fieldValues: any[]): Query<T>;
  // get(): Promise<'QuerySnapshot'>;
  // stream(): NodeJS.ReadableStream;
  // onSnapshot(onNext: (snapshot: QuerySnapshot) => void,
  // onError?: (error: Error) => void): () => void;
  isEqual(other: Query<T>): boolean;
  get(): Promise<QuerySnapshot<T>>;
}

export interface DocumentSnapshot<T> {
  data(): T;
  get<K extends keyof T>(fieldPath: keyof T[K]): any;
  isEqual(other: DocumentSnapshot<T>): boolean;
  id: string;
}

export interface DocumentReference<T> {
  collection<K extends keyof T & string>(path: K): CollectionReference<NonNullable<T[K]>>;
  listCollections(): Promise<CollectionReference<T>[]>;
  create(data: T): Promise<any>;
  set(data: T, options?: { merge?: boolean; mergeFields?: string[] }): Promise<any>;
  update(data: Partial<T>, precondition?: any): Promise<any>;
  delete(precondition?: any): Promise<any>;
  get(): Promise<DocumentSnapshot<T>>;
  isEqual(other: DocumentReference<T>): boolean;
  path: string;
}

export interface CollectionReference<T> extends Query<T> {
  id: string;
  listDocuments(): Promise<DocumentReference<T>[]>;
  doc<K extends keyof T & string>(documentPath: K): DocumentReference<NonNullable<T[K]>>;
  // doc(): DocumentReference<T>;
  add(data: T): Promise<DocumentReference<T>>;
  isEqual(other: CollectionReference<T>): boolean;
  path: string;
}

export interface DatabaseWrapper<T> {
  collection<K extends keyof T & string>(path: K): CollectionReference<NonNullable<T[K]>>;
  doc(documentPath: string): DocumentReference<T>;
  collectionGroup(collectionId: string): Query<T>;
  getAll(...documentRefsOrReadOptions: Array<DocumentReference<T> | any>): Promise<DocumentSnapshot<T>[]>;
  listCollections(): Promise<CollectionReference<T>[]>;
  runTransaction(
    updateFunction: (transaction: Transaction<T | any>) => Promise<T | any>,
    transactionOptions?: { maxAttempts?: number },
  ): Promise<T | any>;
  batch(): WriteBatch<T | any>;
}
export function root<T>(db: DatabaseWrapper<any>): DatabaseWrapper<T> {
  return db as DatabaseWrapper<T>;
}
