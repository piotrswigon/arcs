load(
    "//third_party/java/arcs/build_defs:build_defs.bzl",
    "arcs_kt_particles",
    "arcs_kt_schema",
)

licenses(["notice"])

package(default_visibility = ["//visibility:public"])

arcs_kt_schema(
    name = "schemas",
    srcs = ["Sample.arcs"],
    package = "arcs.testplayground",
)

arcs_kt_particles(
    name = "Sample",
    srcs = ["Sample.kt"],
    package = "arcs.testplayground",
    wasm = False,
    deps = [
        ":schemas",
        "//third_party/kotlin/kotlinx_coroutines",
    ],
)
