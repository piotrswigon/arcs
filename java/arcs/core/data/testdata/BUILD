load(
    "//third_party/java/arcs/build_defs:build_defs.bzl",
    "arcs_kt_gen",
)

package(default_visibility = ["//visibility:public"])

licenses(["notice"])

filegroup(
    name = "examples",
    srcs = glob(
        ["*"],
        exclude = ["BUILD"],
    )
)

arcs_kt_gen(
    name = "example_gen",
    srcs = ["WriterReaderExample.arcs"]
)

arcs_kt_gen(
    name = "ingest_process_retrieve_gen",
    srcs = ["IngestProcessRetrieve.arcs"]
)

# arcs_kt_gen(
#     name = "example_pt1_ingestion_gen",
#     srcs = [
#         "ExamplePt1_Ingestion.arcs",
#     ]
# )

# arcs_kt_gen(
#     name = "example_pt2_processing_gen",
#     srcs = [
#         "ExamplePt2_Processing.arcs",
#     ],
#     deps = [
#         # How to include both the .arcs files that the src imports,
#         # as well as the generated schemas for it?
#         "ExamplePt1_Ingestion.arcs",
#         ":example_pt1_ingestion_gen"
#     ]
# )

# arcs_kt_gen(
#     name = "example_pt3_retrieval_gen",
#     srcs = [
#         "ExamplePt3_Retrieval.arcs"
#     ],
#     deps = [
#         # How to include both the .arcs files that the src imports,
#         # as well as the generated schemas for it?
#         "ExamplePt1_Ingestion.arcs",
#         "ExamplePt2_Processing.arcs",
#         ":example_pt1_ingestion_gen",
#         ":example_pt2_processing_gen",
#     ]
# )
