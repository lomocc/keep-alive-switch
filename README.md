# keep-alive-switch

react-router keep-alive switch component

### Usage

```js
import KeepAliveSwitch from 'keep-alive-switch';

function PointsMall() {
  return (
    <KeepAliveSwitch>
      <Route path="business/list" component={PointsMallList} keepAlive />
      <Route path="business/create" component={PointsMallCreate} />
      <Route path="business/edit" component={PointsMallEdit} />
      <Route path="business/detail" component={PointsMallDetail} />
    </KeepAliveSwitch>
  );
}
```
