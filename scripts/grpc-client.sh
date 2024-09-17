PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
PROTOC_GEN_WEB_PATH="./node_modules/.bin/protoc-gen-grpc-web"
OUT_DIR="./src/app/clients/protos"
PROTO_DIR="./src/app/clients/protos"

protoc --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" --js_out=import_style=commonjs,binary:$OUT_DIR --ts_out=service=grpc-web:$OUT_DIR  -I=$PROTO_DIR "${PROTO_DIR}"/*.proto
ls ${PROTO_DIR}