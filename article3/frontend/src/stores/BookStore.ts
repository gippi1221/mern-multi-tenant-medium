import { createBook, fetchBooks, removeBook } from "@/api";
import type { IBook } from "@/interfaces";
import { makeAutoObservable, runInAction } from "mobx";


export interface IBookStore {
  books: IBook[];
  getBooks: () => Promise<void>;
  addBook: (book: Partial<IBook>) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  isLoading: boolean;
}

class BookStore implements IBookStore {
  private _books: IBook[] = [];
  private _isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async getBooks() {
    try {
      runInAction(() => {
        this._isLoading = true;
      });
      const data = await fetchBooks();
      runInAction(() => {
        this._books = data;
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async addBook(book: Partial<IBook>) {
    try {
      const data = await createBook(book);
      runInAction(() => {
        this._books = this._books.concat(data);
      });
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  }

  async deleteBook(bookId: string) {
    try {
      await removeBook(bookId);
      runInAction(() => {
        this._books = this._books.filter((book) => book._id !== bookId);
      });
      
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }

  get books() {
    return this._books;
  }

  get isLoading() {
    return this._isLoading;
  }

}

export const bookStore = new BookStore();