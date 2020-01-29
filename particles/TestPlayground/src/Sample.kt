package arcs.testplayground

import arcs.sdk.*

import kotlinx.coroutines.flow.*
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlin.coroutines.*

class Sample : AbstractSample() {
    init {
        reactTo(input1.updates, input2.updates) { i1, i2 ->
            if (i1 != null && i2 != null) {
                output.set(Sample_Output(i1.value + i2.value))
            } else {
                output.clear()
            }
        }
    }
}
