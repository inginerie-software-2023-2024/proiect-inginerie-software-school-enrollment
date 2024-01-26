package SchoolEnrollmentSystem.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void testPass() {
		// un test de test sa vad daca trece
		int result = 2;
		assertEquals(2, result, "nu a intrat");
	}
}
