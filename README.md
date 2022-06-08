# vv_check_web

web 上で VV を動かそうとしてみるコード

## 実行

```bash
mkdir -p public/static/js
cp ./node_modules/onnxruntime-web/dist/*.wasm public/static/js/

npx webpack --mode=development

npm start
```

推論が完了したら結果が console.log に表示されます。
