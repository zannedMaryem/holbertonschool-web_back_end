#!/usr/bin/env python3
"""Provide statistics about Nginx logs stored in MongoDB."""

from pymongo import MongoClient


if __name__ == "__main__":
	collection = MongoClient("mongodb://127.0.0.1:27017").logs.nginx

	print("{} logs".format(collection.count_documents({})))
	print("Methods:")

	for method in ["GET", "POST", "PUT", "PATCH", "DELETE"]:
		print("\tmethod {}: {}".format(
			method,
			collection.count_documents({"method": method})
		))

	status_filter = {"method": "GET", "path": "/status"}
	print("{} status check".format(collection.count_documents(status_filter)))
