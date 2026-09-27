class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.pagination = {};
    this.filterConditions = {};
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      const searchConditions = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { vendor: { $regex: keyword, $options: 'i' } },
        ],
      };
      if (this.filterConditions.$or) {
        this.filterConditions.$and = this.filterConditions.$and || [];
        this.filterConditions.$and.push({ $or: this.filterConditions.$or });
        delete this.filterConditions.$or;
        this.filterConditions.$and.push(searchConditions);
      } else {
        this.filterConditions.$or = searchConditions.$or;
      }
      this.query = this.query.find(searchConditions);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

    const parsed = JSON.parse(queryStr);
    this.filterConditions = { ...this.filterConditions, ...parsed };
    this.query = this.query.find(parsed);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }

  async count() {
    const totalDocuments = await this.query.model.countDocuments(this.filterConditions);
    this.pagination.totalDocuments = totalDocuments;
    this.pagination.totalPages = Math.ceil(totalDocuments / this.pagination.limit);
    return this;
  }
}

module.exports = APIFeatures;