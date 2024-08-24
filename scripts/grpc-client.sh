PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-grpc-web"
OUT_DIR="./src/clients/protos"
PROTO_DIR="./src/clients/protos"

#  --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}"
# Generate TypeScript code
# protoc --proto_path="${PROTO_DIR}" --js_out="import_style=commonjs,binary:${OUT_DIR}" --ts_out="service=grpc-web:${OUT_DIR}" "${PROTO_DIR}"/*.proto
# grpcwebtext

 protoc -I=$PROTO_DIR "${PROTO_DIR}"/*.proto --plugin="protoc-gen-grpc-web=${PROTOC_GEN_TS_PATH}" --js_out=import_style=commonjs,binary:$OUT_DIR  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR


# npx protoc --ts_out="service=grpc-web:${OUT_DIR}" --proto_path "${PROTO_DIR}"  "${PROTO_DIR}"/*.proto