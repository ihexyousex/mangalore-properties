
const fs = require('fs');
const path = require('path');

const backupPath = path.join('components', 'admin', 'ProjectForm.tsx.backup');
const targetPath = path.join('components', 'admin', 'ProjectForm.tsx');

try {
    let content = fs.readFileSync(backupPath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 1. Remove orphaned attributes (lines 433-436 in backup)
        if (line.trim().startsWith('value={formData.completion_percentage}')) {
            // Skip this line and the next 3 lines
            i += 3;
            continue;
        }

        // 2. Fix Builder Section Closing (around line 437-439 in backup)
        // We look for the closing div of the dropdown content
        if (line.trim() === '</div>' && lines[i + 2] && lines[i + 2].trim() === '</div>' && lines[i - 1].includes(')}')) {
            // This logic is tricky with line numbers changing.
            // Let's rely on specific context.
        }

        newLines.push(line);
    }

    // Let's try a string replacement approach instead of line-by-line for the complex parts
    let text = content;

    // 1. Remove orphaned attributes
    const orphanedRegex = /value={formData\.completion_percentage}[\s\S]*?className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"\s*\/>/g;
    text = text.replace(orphanedRegex, '');

    // 2. Fix Builder Section Closing
    // Look for the end of the builder dropdown map
    // The backup has:
    //                                     )}
    //
    //                                 </div>
    //
    //                 </div>

    // We want to change:
    //                                 </div>
    //
    //                 </div>
    // TO:
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>

    // Locate the specific block
    const builderFixTarget = `                                    )}

                                </div>

                </div>`;

    const builderFixReplacement = `                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>`;

    // Note: The indentation in the file might be tabs or spaces. The backup view showed spaces.
    // Let's try to be flexible or precise.
    // The backup view showed:
    // 432:                                     )}
    // 437:                                 </div>
    // 439:                 </div>

    // After removing orphans, we have:
    //                                     )}
    //                                 </div>
    //                 </div>

    // Let's use a more robust replace.
    const builderSectionEnd = `                                    )}

                                </div>

                </div>`;

    if (text.includes(builderSectionEnd)) {
        text = text.replace(builderSectionEnd, builderFixReplacement);
        console.log("Applied Builder Section Fix");
    } else {
        // Try without the extra newlines if they were removed
        const builderSectionEnd2 = `                                    )}
                                </div>

                </div>`;
        if (text.includes(builderSectionEnd2)) {
            text = text.replace(builderSectionEnd2, builderFixReplacement);
            console.log("Applied Builder Section Fix (Variant 2)");
        } else {
            console.log("WARNING: Could not find Builder Section target");
            // Fallback: Look for the dropdown closing div
            const target = '                                </div>\r\n\r\n                </div>';
            // This is risky.
        }
    }

    // 3. Add closing div for Basic Info before Image Uploads
    const imageUploadsHeader = `{/* Image Uploads - REDESIGNED */}`;
    if (text.includes(imageUploadsHeader)) {
        text = text.replace(imageUploadsHeader, `</div>\n\n                        ${imageUploadsHeader}`);
        console.log("Applied Basic Info Closing Fix");
    } else {
        console.log("WARNING: Could not find Image Uploads header");
    }

    // 4. Fix Malformed Tags at the end
    text = text.replace(/<\/div >/g, '</div>');
    text = text.replace(/< div className="pt-4" >/g, '<div className="pt-4">');
    text = text.replace(/<\/form >/g, '</form>');

    fs.writeFileSync(targetPath, text, 'utf8');
    console.log("Successfully wrote fixed ProjectForm.tsx");

} catch (err) {
    console.error("Error:", err);
}
