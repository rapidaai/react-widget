export const initialPaginated = {
  /**
   *
   */
  page: 1,

  /**
   *
   */
  pageSize: 20,

  /**
   *
   */
  totalCount: 0,

  /**
   *
   */
  criteria: [],

  /**
   *
   */
  columns: [],

  addCriteria: function (key: string, value: string, logic: string): void {
    throw new Error("Function not implemented.");
  },

  clearCriteria: function (): void {
    throw new Error("Function not implemented.");
  },

  setTotalCount: function (number: any): void {
    throw new Error("Function not implemented.");
  },
  setPage: function (number: any): void {
    throw new Error("Function not implemented.");
  },
  setPageSize: function (number: any): void {
    throw new Error("Function not implemented.");
  },
  setColumns: function (
    cl: { name: string; key: string; visible: boolean }[]
  ): void {
    throw new Error("Function not implemented.");
  },
  visibleColumn: function (k: string): boolean {
    throw new Error("Function not implemented.");
  },
};

/**
 *
 */
export type PaginatedType = {
  /**
   * page
   */
  page: number;

  /**
   * page size
   */
  pageSize: number;

  /**
   * total count
   */
  totalCount: number;

  /**
   *
   */
  criteria: { key: string; value: string; logic: string }[];

  /**
   *
   * @param key
   * @param value
   * @returns
   */
  addCriteria: (key: string, value: string, logic: string) => void;

  /**
   *
   * @returns
   */
  clearCriteria: () => void;

  /**
   *
   * @param number
   * @returns
   */
  setTotalCount: (n: number) => void;

  /**
   *
   * @param n: number
   * @returns
   */
  setPage: (n: number) => void;

  /**
   *
   * @param n: number
   * @returns
   */
  setPageSize: (n: number) => void;
};
