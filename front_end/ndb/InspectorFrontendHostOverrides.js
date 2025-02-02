/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

(async function(){
  InspectorFrontendHost.getPreferences = async function(callback) {
    [Ndb.backend] = await carlo.loadParams();
    const prefs = {
      '__bundled__uiTheme': '"dark"'
    };
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      prefs[key] = window.localStorage.getItem(key);
    }
    callback(prefs);
  };

  InspectorFrontendHost.isHostedMode = () => false;
  InspectorFrontendHost.copyText = text => navigator.clipboard.writeText(text);
  InspectorFrontendHost.openInNewTab = url => Ndb.backend.openInNewTab(url);
  InspectorFrontendHost.bringToFront = () => Ndb.backend.bringToFront();
  InspectorFrontendHost.loadNetworkResource = async(url, headers, streamId, callback) => {
    const text = await Ndb.backend.loadNetworkResource(url, headers);
    if (text) {
      Host.ResourceLoader.streamWrite(streamId, text);
      callback({statusCode: 200});
    } else {
      callback({statusCode: 404});
    }
  };

  // InspectorFrontendHost.sendMessageToBackend = rawMessage => {
  //   const parsedMes = JSON.parse(rawMessage);
  //   if (parsedMes.method !== 'Network.getResponseBody')
  //     return;
  //
  //   const mes = await target.runtimeAgent().invoke_evaluate({
  //     expression: `process._sendMessage(${JSON.stringify(JSON.parse(rawMessage))})`,
  //     awaitPromise: true
  //   });
  //
  //   if (!mes.result) return;
  //   try {
  //     const [id, result] = mes.result.value;
  //     if (result) {
  //       InspectorFrontendHost.events.dispatchEventToListeners(
  //           InspectorFrontendHostAPI.Events.DispatchMessage,
  //           {
  //             id,
  //             result
  //           }
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  //
  // while (true) {
  //   const message = await target.runtimeAgent().invoke_evaluate({
  //     expression: 'process._getNetworkMessages()',
  //     awaitPromise: true
  //   });
  //
  //   if (!message.result) return;
  //   const arrMessages = JSON.parse(message.result.value);
  //
  //   for (const mes of arrMessages) {
  //     const { type, payload } = mes;
  //
  //     if (type) {
  //       SDK._mainConnection._onMessage(JSON.stringify({
  //         method: type,
  //         params: payload
  //       }));
  //     }
  //   }
  // }

})();
