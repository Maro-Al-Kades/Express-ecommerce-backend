class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // 1. Filtering
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    // Apply Filteration using [gte, gt, lte, lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  // 2. Searching
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  // 3. Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  // 4. Fields Limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  // 5. Pagination
  paginate(countDocuments) {
    const PAGE = this.queryString.page * 1 || 1;
    const LIMIT = this.queryString.limit * 1 || 50;
    const SKIP = (PAGE - 1) * LIMIT;
    const END_INDEX = PAGE * LIMIT;

    const pagination = {};
    pagination.currentPage = PAGE;
    pagination.limit = LIMIT;
    pagination.numberOfPages = Math.ceil(countDocuments / LIMIT);

    if (END_INDEX < countDocuments) {
      pagination.next = PAGE + 1;
    }

    if (SKIP > 0) {
      pagination.prev = PAGE - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(SKIP).limit(LIMIT);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
