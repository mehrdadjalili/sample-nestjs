class PaginationRequest {
  pageNumber: number;
  limit: number;
  sort: 'asc' | 'desc';
  serachText: string;

  getSkip(): number {
    if (this.pageNumber <= 1) {
      return 0;
    }
    return (this.pageNumber - 1) * this.limit;
  }
}
