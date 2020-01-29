package arcs.testplayground

import com.google.common.truth.Truth.assertThat
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class SampleTest {

    @Test
    fun testParticle() {
        val s = Sample()
        assertThat(s._output.get()).isNull();

        s._input1.set(Sample_Input1(value = 2.0))
        assertThat(s._output.get()).isNull();

        s._input2.set(Sample_Input1(value = 5.0))
        // ----
        // Thread.sleep() needed to let coroutine do work.
        // We need a suspend function that waits on a handle to update and then asserts its value
        // Or something like that
        // ----
        Thread.sleep(10)
        assertThat(s._output.get()?.value).isEqualTo(7.0)

        s._input1.clear()
        Thread.sleep(10)
        assertThat(s._output.get()).isNull();

        s._input1.set(Sample_Input1(value = 8.0))
        Thread.sleep(10)
        assertThat(s._output.get()?.value).isEqualTo(13.0)

        s._input2.clear()
        Thread.sleep(10)
        assertThat(s._output.get()?.value).isNull();
    }
}
