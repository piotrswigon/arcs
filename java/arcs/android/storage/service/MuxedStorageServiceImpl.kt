/*
 * Copyright 2020 Google LLC.
 *
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 *
 * Code distributed by Google as part of this project is also subject to an additional IP rights
 * grant found at
 * http://polymer.github.io/PATENTS.txt
 */

package arcs.android.storage.service

/**
 * Implementation of the [IMuxedStorageService] AIDL interface. Responsible for forwarding messages
 * to [DirectStorageMuxers] and back again.
 */
class MuxedStorageServiceImpl : IMuxedStorageService.Stub() {
  override fun openMuxedStorageChannel(callback: IStorageChannelCallback): IStorageChannel {
    TODO("b/162747024 - implement me")
  }
}