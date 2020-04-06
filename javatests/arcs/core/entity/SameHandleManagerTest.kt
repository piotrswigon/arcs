package arcs.core.entity

import arcs.core.host.EntityHandleManager
import arcs.core.storage.StoreManager
import arcs.core.util.testutil.LogRule
import arcs.jvm.util.testutil.TimeImpl
import com.google.common.truth.Truth
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@Suppress("EXPERIMENTAL_API_USAGE")
@RunWith(JUnit4::class)
class SameHandleManagerTest : HandleManagerTestBase() {

    @get:Rule var logRule = LogRule()

    @Before
    override fun setUp() {
        super.setUp()
        readHandleManager = EntityHandleManager(
            arcId = "testArc",
            hostId = "testHost",
            time = TimeImpl(),
            stores = StoreManager()
        )
        writeHandleManager = readHandleManager
    }

    @Test
    fun collection_writeAllAndReadBack() = testRunner {
        val writeHandle = writeHandleManager.createCollectionHandle()
        writeHandle.storeAll(setOf(entity1, entity2))

        // Now read back from a different handle
        val readHandle = readHandleManager.createCollectionHandle()
        val readBack = readHandle.fetchAll()
        Truth.assertThat(readBack).containsExactly(entity1, entity2)
    }

    @After
    override fun tearDown() = super.tearDown()
}
