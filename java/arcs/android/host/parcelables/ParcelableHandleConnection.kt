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

package arcs.android.host.parcelables

import android.os.Parcel
import android.os.Parcelable
import arcs.android.type.readType
import arcs.android.type.writeType
import arcs.core.data.Plan
import arcs.core.storage.StorageKeyParser

/** [Parcelable] variant of [Plan.HandleConnection]. */
data class ParcelableHandleConnection(
    override val actual: Plan.HandleConnection
) : ActualParcelable<Plan.HandleConnection> {
    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(actual.storageKey?.toString())
        parcel.writeType(actual.type, flags)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<ParcelableHandleConnection> {
        override fun createFromParcel(parcel: Parcel): ParcelableHandleConnection {
            val storageKeyString = parcel.readString()
            val type = requireNotNull(parcel.readType()) {
                "No name found in Parcel"
            }

            return ParcelableHandleConnection(
                Plan.HandleConnection(
                    storageKeyString?.let { StorageKeyParser.parse(it) },
                    type
                )
            )
        }

        override fun newArray(size: Int): Array<ParcelableHandleConnection?> =
            arrayOfNulls(size)
    }
}

/** Wraps a [Plan.HandleConnection] as a [ParcelableHandleConnection]. */
fun Plan.HandleConnection.toParcelable(): ParcelableHandleConnection =
    ParcelableHandleConnection(this)

/** Writes a [Plan.HandleConnection] to a [Parcel]. */
fun Parcel.writeHandleConnectionSpec(handleConnection: Plan.HandleConnection, flags: Int) =
    writeTypedObject(handleConnection.toParcelable(), flags)

/** Reads a [Plan.HandleConnection] from a [Parcel]. */
fun Parcel.readHandleConnectionSpec(): Plan.HandleConnection? =
    readTypedObject(ParcelableHandleConnection)?.actual